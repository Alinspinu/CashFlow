import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { formatOrderDateOne } from 'src/app/shared/utils/functions';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { Preferences } from '@capacitor/preferences';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CashInOutPage } from 'src/app/modals/cash-in-out/cash-in-out.page';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/content/content.service';
import { Category } from 'src/app/models/category.model';




Chart.register(ChartDataLabels);


@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChartPage]
})
export class SalesPage implements OnInit, OnChanges, OnDestroy {

  users: any[] = []
  totals: PaymentDetail = emptyToatals()

  hours: hour[] = []
  allCats: Category[] = []

  gamaColors: gamaTreshold[] = lightGama()

  catSubs!: Subscription

  serviceSum: number = 0

  private chart!: Chart;

  @Input() access: number = 1
  @Input() orders!: Bill[]
  @Output() date: EventEmitter<string> = new EventEmitter();



  activeTabIndex: number = 0

  private colors: colors = lightColors()

  public chartData!: ChartData<'pie'>
  public chartOptions!: ChartOptions
  public chartType: ChartType = 'pie';

  constructor(
    private cdr: ChangeDetectorRef,
    private cashService: CashControlService,
    private toastCtrl: ToastController,
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService
  ) { }

  ngOnInit() {
    this.getOrders()
    this.getData()
    this.getServiceSum()
  }

  ngOnDestroy(): void {
      if(this.chart){
        this.chart.destroy()
      }
      if(this.catSubs){
        this.catSubs.unsubscribe()
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orders'] && !changes['orders'].firstChange) {
      const orders = this.orders.filter(o => o.status === 'done')
      this.totals = calcCashIn(orders)
      this.hours = calcHours(orders, this.totals.total)
      this.getColors()
      this.updateHourstData()
    }
  }

getOrders(){
  this.cashService.ordersSend$.subscribe({
    next: (orders) => {
      this.orders = orders.filter(o => o.status === 'done')
      this.totals = calcCashIn(this.orders)
      this.hours = calcHours(this.orders, this.totals.total)
      this.updateHourstData()
      this.getColors()
    },
    error: (error) => {
      console.log(error)
    }
  })
}


getData(){
  this.catSubs = this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.allCats = [...response]
      }
    })
  }



async selectDate(day: boolean){
  if(day) {
    const day = await this.actSrv.openAuth(DatePickerPage)
    this.cashService.getAllorders(day, undefined, undefined).subscribe()
    this.date.emit(`${formatOrderDateOne(day)}`)
  } else {
    const stDate = await this.actSrv.openPayment(DatePickerPage, 'ALEGE ZIUA DE ÎNCEPUT')
    if(stDate){
      const enDate = await this.actSrv.openPayment(DatePickerPage, 'ALEGE ZIUA DE SFÂRȘIT')
      this.cashService.getAllorders(undefined, stDate, enDate).subscribe()
       this.date.emit(`${formatOrderDateOne(stDate)} - ${formatOrderDateOne(enDate)}`)
    }
  }
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
  this.cashService.cashInAndOut(data).subscribe(response => {
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
    const response = await this.actSrv.deleteAlert('PRINTEAZĂ RAPORTUL Z', 'RAPORT Z')
    if(response){
      this.reports(value)
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
  this.cashService.raport(value).subscribe(response => {
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



