import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Product } from 'src/app/models/category.model';
import { emptyProduct } from 'src/app/models/empty-models';
import { Chart } from 'chart.js';
import { darkGama, gamaTreshold, lightGama } from 'src/app/shared/chart/chart.colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';



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


  gamaColors: gamaTreshold[] = lightGama()

  private chart!: Chart;




  today: boolean = true
  thisWeek: boolean = false
  lastWeek: boolean = false
  thisMonth: boolean = false
  lastMonth: boolean = false
  custom: boolean = false
  bar = 'today'

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.updateHourstData()
    console.log(this.product)
  }


  selectSegment(event: any){
    if(this.bar === 'today'){
      this.today = true
      this.thisWeek = false
      this.lastWeek = false
      this.thisMonth = false
      this.lastMonth = false
      this.custom = false
    }
    if(this.bar === 'thisWeek'){
      this.today = false
      this.thisWeek = true
      this.lastWeek = false
      this.thisMonth = false
      this.lastMonth = false
      this.custom = false
    }
    if(this.bar === 'lastWeek'){
      this.today = false
      this.thisWeek = false
      this.lastWeek = true
      this.thisMonth = false
      this.lastMonth = false
      this.custom = false
    }
    if(this.bar === 'thisMonth'){
      this.today = false
      this.thisWeek = false
      this.lastWeek = false
      this.thisMonth = true
      this.lastMonth = false
      this.custom = false
    }
    if(this.bar === 'lastMonth'){
      this.today = false
      this.thisWeek = false
      this.lastWeek = false
      this.thisMonth = false
      this.lastMonth = true
      this.custom = false
    } 
    if(this.bar === 'custom'){
      this.today = false
      this.thisWeek = false
      this.lastWeek = false
      this.thisMonth = false
      this.lastMonth = true
      this.custom = true
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
  const hours = this.product.saleLog[0].hours.map(h => h.label)
  const totals = this.product.saleLog[0].hours.map(h => h.qty)
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


  getColors(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
    this.updateHourstData()
    this.cdr.detectChanges();
    prefersDark.addListener((mediaQuery) => {
      prefersDark.matches ? this.gamaColors = darkGama() : this.gamaColors = lightGama()
      this.updateHourstData()
      this.cdr.detectChanges();
    });
  }

}
