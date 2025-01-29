import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Product } from 'src/app/models/category.model';
import { emptyProduct } from 'src/app/models/empty-models';
import { Chart, Legend } from 'chart.js';
import { darkGama, gamaTreshold, lightGama } from 'src/app/shared/chart/chart.colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatTitleDate, round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { SaleLog, emptyLog, updateLog } from './report.engine';



Chart.register(ChartDataLabels);

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReportPage implements OnInit {

  @Input() product: Product = emptyProduct()

  saleLog: SaleLog | undefined = emptyLog()


  gamaColors: gamaTreshold[] = lightGama()

  productTotal: number = 0



  private chart!: Chart;

  today = new Date().toISOString()


dayy: boolean = false
viewButton: boolean = false

  // today: boolean = true
  thisWeek: boolean = false
  lastWeek: boolean = false
  thisMonth: boolean = false
  lastMonth: boolean = false
  custom: boolean = false
  bar = 'today'

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }

  ngOnInit() {
    this.saleLog = updateLog(this.product, this.today, undefined)
    console.log(this.product)
    console.log(this.saleLog)
    this.updateHourstData(false)
  }


changeChard(){
  this.dayy = !this.dayy
   this.dayy ? this.updateHourstData(this.dayy) : this.updateHourstData(this.dayy)
}

selectMonth(){
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()
  const startDate = new Date(year, month, 1)
  this.saleLog = updateLog(this.product, startDate.toISOString(), date.toISOString() )
  this.dayy = true
  this.viewButton = true
  this.updateHourstData(true)
}


  async selectDate(day: boolean){
    if(day) {
      const day = await this.actionSheet.openAuth(DatePickerPage)
      if(day){
        this.saleLog = emptyLog()
        this.saleLog = updateLog(this.product, day, undefined)
        this.updateHourstData(false)
        this.dayy = false
        this.viewButton = false
      }
    } else {
      const stDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE ÎNCEPUT')
      if(stDate){
        const enDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE SFÂRȘIT')
        this.saleLog = emptyLog()
        this.saleLog = updateLog(this.product, stDate, enDate)
        this.dayy = true
        this.viewButton = true
        this.updateHourstData(true)
      }
    }
  }


    calcSubProductProductionPrice(product: any, qty: number){
        let total = 0
        if(product.ings.length){
          product.ings.forEach((el:any) => {
            if(el.ing){
              total = round(total + (el.qty * el.ing.price))
            } else {
              console.log(product)
            }
          }
          )
        }
        return round(total * qty)
    }


  calcProductProduction(product: any, qty: number){
      if(product.subProducts.length){
        let total = 0
        for(let sub of product.subProducts){
          if(sub.saleLog.length){
            total += this.calcSubProductProductionPrice(sub, sub.saleLog[0].qty)
          }
        }
        return round(total)
      } else {
        let total = 0
        if(product.ings.length){
          product.ings.forEach((el:any) => {
            if(el.ing){
              total = round(total + (el.qty * el.ing.price))
            } else {
              console.log(product)
            }
          }
          )
        }
        return round(total * qty)
      }
  }


roundInHtml(num: number){
  return round(num)
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




updateHourstData(day: boolean){
  let hours = ['']
  let totals = [0]
  if(day){
    hours = this.saleLog ?  this.saleLog.days.map(d => d.day) : ['']
    totals = this.saleLog ? this.saleLog.days.map(d => d.qty) : [0]
  } else {
    hours = this.saleLog ?  this.saleLog.hours.map(h => h.label) : ['']
    totals = this.saleLog ? this.saleLog.hours.map(h => h.qty) : [0]
  }
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
  this.chart.update()
} else {
  this.chart =  new Chart('hour-canvas', {
    type: 'bar',
    data: hourChartData,
    options: hourChartOptions,
    plugins: [ChartDataLabels]
  });
}

}


  getColors(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
    this.updateHourstData(this.dayy)
    this.cdr.detectChanges();
    prefersDark.addListener((mediaQuery) => {
      prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
      this.updateHourstData(this.dayy)
      this.cdr.detectChanges();
    });
  }

  formateDate(date: any){
    return formatTitleDate(date)
  }

}


//   selectSegment(event: any){
//     if(this.bar === 'today'){
//       this.today = true
//       this.thisWeek = false
//       this.lastWeek = false
//       this.thisMonth = false
//       this.lastMonth = false
//       this.custom = false
//     }
//     if(this.bar === 'thisWeek'){
//       this.today = false
//       this.thisWeek = true
//       this.lastWeek = false
//       this.thisMonth = false
//       this.lastMonth = false
//       this.custom = false
//     }
//     if(this.bar === 'lastWeek'){
//       this.today = false
//       this.thisWeek = false
//       this.lastWeek = true
//       this.thisMonth = false
//       this.lastMonth = false
//       this.custom = false
//     }
//     if(this.bar === 'thisMonth'){
//       this.today = false
//       this.thisWeek = false
//       this.lastWeek = false
//       this.thisMonth = true
//       this.lastMonth = false
//       this.custom = false
//     }
//     if(this.bar === 'lastMonth'){
//       this.today = false
//       this.thisWeek = false
//       this.lastWeek = false
//       this.thisMonth = false
//       this.lastMonth = true
//       this.custom = false
//     }
//     if(this.bar === 'custom'){
//       this.today = false
//       this.thisWeek = false
//       this.lastWeek = false
//       this.thisMonth = false
//       this.lastMonth = true
//       this.custom = true
//     }
// }
