import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartType, Legend } from 'chart.js';
import { CashControlService } from '../cash-control.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartPage } from 'src/app/shared/chart/chart.page';
import { colors, darkColors, darkGama, gamaTreshold, lightColors, lightGama } from 'src/app/shared/chart/chart.colors';
import { calcCashIn, calcHours, emptyToatals, hour, PaymentDetail, setZeroDiscount, showPayment} from '../cash-control-engine';
import { Bill } from 'src/app/models/table.model';
import { Preferences } from '@capacitor/preferences';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CashInOutPage } from 'src/app/modals/cash-in-out/cash-in-out.page';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/content/content.service';
import { Category } from 'src/app/models/category.model';
import { HeaderPage } from '../header/header.page';
import { ConfigService } from 'src/app/config/config.service';
import { SalePointService } from 'src/app/office/sale-point/sale-point.service';




Chart.register(ChartDataLabels);


@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChartPage, HeaderPage]
})
export class SalesPage implements OnInit, OnDestroy {

  totals: PaymentDetail = emptyToatals()

  hours: hour[] = []
  allCats: Category[] = []

  gamaColors: gamaTreshold[] = lightGama()

  catSubs!: Subscription

  openOrders: Bill[] = []

  serviceSum: number = 0

  printServers: any = []
  mainServer!: any

  pointSub!: Subscription

  private chart!: Chart;

  @Input() access: number = 1
  orders!: Bill[]


  private colors: colors = lightColors()

  public chartData!: ChartData<'pie'>
  public chartOptions!: ChartOptions
  public chartType: ChartType = 'pie';


  constructor(
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private cdr: ChangeDetectorRef,
    private cashService: CashControlService,
    private toastCtrl: ToastController,
    private contSrv: ContentService,
    private configSrv: ConfigService,
    private pointService: SalePointService,
  ) { }

  ngOnInit() {
    this.getData()
    this.getServiceSum()
    this.getPointId()
  }

  ngOnDestroy(): void {
      if(this.chart){
        this.chart.destroy()
      }
      if(this.catSubs){
        this.catSubs.unsubscribe()
      }
      if(this.pointSub) this.pointSub.unsubscribe()
  }

  getPointId(){
    this.pointSub = this.pointService.pointSend$.subscribe({
      next: (p) => {
        if(p._id) this.getPrintServerFlromLocal(p._id)
      }
    })
  }




async getPrintServerFlromLocal(p: string){
   const { value } = await Preferences.get({key: 'mainServer'})
   if(value){
      const server = JSON.parse(value)
      if(server.salePoint === p){
        this.mainServer = server
      } else {
        this.getServersFromDd()
      }
   } else {
     this.getServersFromDd()
   }
  }

  getServersFromDd(){
    this.configSrv.serversSend$.subscribe({
      next: async (response) => {
        this.printServers = response
        const data = this.printServers.map((s: any) => s.name)
        const server = await this.actSrv.entryAlert(data, 'radio', 'Server de bonuri', 'Alege serverul de bonuri!', '', '')
        if(server){
          const choice = this.printServers.find((s:any) => s.name === server)
          if(choice){
            this.mainServer = choice
            await Preferences.set({key: 'mainServer', value: JSON.stringify(choice)})
          }
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }





  reciveData(ev: any){
    this.orders = ev.orders.filter((o: any) => o.status === 'done')
    this.openOrders = ev.orders.filter((o: any) => o.status === 'open' && o.masa !== 89)
    this.totals = calcCashIn(this.orders)
    this.hours = calcHours(this.orders, this.totals.total)
    this.updateHourstData()
    this.getColors()
  }




getData(){
  this.catSubs = this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.allCats = [...response]
      }
    })
  }


async inAndOut(value: string){
  if(value === 'in'){
    const response = await this.actSrv.openPayment(CashInOutPage, value)
    if(response){
      const data = {
        mode: value,
        sum: response.value
      }
      this.handleInAndOut(data)
    }
  } else {
     this.handleInAndOut({mode: value, sum: this.serviceSum})
  }
 }

 handleInAndOut(data: any){
  this.cashService.cashInAndOut(data, this.mainServer).subscribe(response => {
    if(response){
      if(data.mode === 'in'){
        this.serviceSum = data.sum
        const sum = {serviceSum: this.serviceSum}
        Preferences.set({key: 'serviceSum', value: JSON.stringify(sum)})
      } else {
        this.serviceSum = 0
        Preferences.remove({key: 'serviceSum'})
      }
      showToast(this.toastCtrl, response.message, 3000)
    }
   }, error => {
    if(error){
       showToast(this.toastCtrl, error.error.message, 3000)
    }
   })
 }


 getServiceSum(){
   Preferences.get({key: 'serviceSum'}).then(data => {
     if(data.value){
       const sum = JSON.parse(data.value)
        this.serviceSum = sum.serviceSum
     }
  })
 }



async onReports(value: string){
  if(value === 'z'){
    if(this.openOrders.length > 0){
        const message = this.openOrders.map(o => o.masa + ' ')
        await this.actSrv.deleteAlert(`Sunt comenzi deschise deschise la mesele ${message}`, 'Scoate comenzile!')
    } else {
      const response = await this.actSrv.deleteAlert('PRINTEAZĂ RAPORTUL Z', 'RAPORT Z')
      if(response){
        this.reports(value)
      }
    }
  } else {
    this.reports(value)
  }
}


reports(value: string){
  this.cashService.removeProductDiscount(setZeroDiscount(this.allCats)).subscribe(response => {
    if(response){

    }
  })
  this.cashService.raport(value, this.mainServer).subscribe(response => {
    if(response){
      if(value === 'z'){
        Preferences.remove({key: 'payments'})
        Preferences.remove({key: 'serviceSum'})
        this.serviceSum = 0
      }
      showToast(this.toastCtrl, response.message, 3000)
    }
  }, error => {
    if(error){
      showToast(this.toastCtrl, error.error.message, 3000)
    }
  })
}




  getColors(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.matches ? this.colors = darkColors() : this.colors = lightColors()
    prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
    this.updateChartData()
    this.updateHourstData()
    this.cdr.detectChanges();
    prefersDark.addListener((mediaQuery) => {
      mediaQuery.matches ? this.colors = darkColors() : this.colors = lightColors()
      prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
      this.updateChartData()
      this.updateHourstData()
      this.cdr.detectChanges();
    });
  }


  updateChartData(){
    const values = this.showPaymentMethod(this.totals).map(p => p.value)
    const colors = this.showPaymentMethod(this.totals).map(p => p.color)
    const contrast = this.showPaymentMethod(this.totals).map(p => p.contrast)
    this.chartData = {
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: contrast,
          borderWidth: 1.2,
          borderColor: this.colors.lightSand
        }
      ]
    }
    this.chartOptions = {
      responsive: true,
      animation: {
        duration: 600,
        easing: 'easeInOutQuad',
      },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          },
          title: {
            display: false
          },
          datalabels: {
            color: this.colors.medium,
            font: {
              size: 14,
              family: 'RoseMed',
            },
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((acc, curr) => {
                const a = typeof acc === 'number' ? acc : 0;
                const b = typeof curr === 'number' ? curr : 0;
                return a + b;
              }, 0);

              if (typeof total === 'number' && value > total * 0.1) {
                return `${value} Lei`;
              }
              return '';
            },
            anchor: 'center',
            align: 'bottom',
          }
        }
    }
  }



  getColor(value: number) {
    const data = this.gamaColors
    for (let i = 0; i < data.length; i++) {
      if (value <= data[i].value) {
        return data[i].color;
      }
    }
    return data[data.length - 1].color;
  }


  updateHourstData(){
    const hours = this.hours.map(h => h.stHour)
    const totals = this.hours.map(h => h.total)
    const backgroundColors = totals.map(value => this.getColor(value));
    const hourChartData = {
      labels: hours,
      datasets: [{
        data: totals,
        backgroundColor: backgroundColors,
        borderColor: ['transparent'],
        borderWidth: 1,
        // barThickness: 60
      }]
    };

    const hourChartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }

      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          color: '#000000',
          font: {
            family: 'RoseReg',
            size: 12
          },
          formatter: (value: any) => value,
        },

      }
  }

  if(this.chart){
    this.chart.data.labels = hours
    this.chart.data.datasets[0].data = totals
    this.chart.data.datasets[0].backgroundColor = backgroundColors
    // this.chart.update()
  } else {
    // this.chart =  new Chart('hour-canvas', {
    //   type: 'bar',
    //   data: hourChartData,
    //   options: hourChartOptions,
    //   plugins: [ChartDataLabels]
    // });
  }

}





  showPaymentMethod(payment: any){
    return showPayment(payment, this.colors, this.orders)
  }

  }



