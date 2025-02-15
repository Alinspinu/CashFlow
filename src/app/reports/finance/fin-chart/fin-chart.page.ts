import { ChangeDetectorRef, Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chart, ChartEvent } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { colors, darkColors, lightColors } from 'src/app/shared/chart/chart.colors';
import { roundOne } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ModalPage } from './modal/modal.page';





export interface chartDay {
  label: string,
  cashIn: number,
  ingsValue: number,
  deps: number,
  spendings: number,
  workValue: number,
  profit: number
}

Chart.register(ChartDataLabels);


@Component({
  selector: 'app-fin-chart',
  templateUrl: './fin-chart.page.html',
  styleUrls: ['./fin-chart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FinChartPage implements OnInit, OnChanges {

  private chart!: Chart;

  @Input() chartDays: chartDay[] = []

  private colors: colors = lightColors()

  labelColor: string = '#000000'

  constructor(
      private cdr: ChangeDetectorRef,
      @Inject(ActionSheetService) private actionSheetService: ActionSheetService
  ) { }

  ngOnInit() {
    if(this.chartDays.length){
      this.getColors()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['chartDays']){
        this.getColors()
      }
  }



async openPie(day: chartDay) {
  await this.actionSheetService.openAdd(ModalPage, day, 'small')
}

  updateHourstData(){
    let days = ['']
    let profit = [0]
    let income = [0]
    days = this.chartDays.map(d => d.label)
    profit = this.chartDays.map(d => roundOne(d.profit))
    income = this.chartDays.map(d => roundOne(d.cashIn))
    const hourChartData = {
      labels: days,
      datasets: [
        {
          label: 'Încasări',
          data : income,
          backgroundColor: this.colors.blueRGBA,
          hoverBackgroundColor: this.colors.blueContrast,
          barThickness: 15,
          borderColor: this.colors.blue,
          hoverBorderColor: this.colors.blueContrast,
          borderWidth: 1,
        },
        {
        label: 'Profit',
        data: profit,
        backgroundColor: this.colors.greenRGBA,
        hoverBackgroundColor: this.colors.greenContrast,
        barThickness: 15,
        borderColor: this.colors.green,
        hoverBorderColor: this.colors.greenContrast,
        borderWidth: 1,
       },
    ]
    };

    const hourChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      onClick: (event: ChartEvent, elements: any) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          this.openPie(this.chartDays[index])
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false,
            lineWidth: 0.1,
            color: this.colors.medium,
          },
          ticks: {
            stepSize: 1000,
            color: this.colors.medium,
            font: {
              family: 'RoseLight',
              size: 12,
            }
          },
        },
        x: {
          ticks: {
            color: this.colors.medium,
            font: {
              family: 'RoseLight',
              size: 10,
            }
          },
          grid: {
            color: this.colors.medium,
            lineWidth: 0.1,
            display: false,
          }
        }

      },
      plugins: {
        legend: {
          display: true
        },

        datalabels: {
          display: true,
          color: this.colors.medium,
          font: {
            family: 'RoseReg',
            size: 12
          },
          formatter: (value: any) => value,
          anchor: 'end' as 'end',
          align: 'top' as 'top',
        },

      }
  }

  if(this.chart){
    this.chart.data = hourChartData,
    this.chart.options = hourChartOptions
    this.chart.update()
  } else {
    this.chart =  new Chart('day-canvas', {
      type: 'bar',
      data: hourChartData,
      options: hourChartOptions,
      plugins: [ChartDataLabels]
    });
  }

  }

    getColors(){
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.matches ?  this.colors = darkColors() :  this.colors = lightColors()
      this.updateHourstData()
      this.cdr.detectChanges();
      prefersDark.addListener((mediaQuery) => {
        prefersDark.matches ?  this.colors = darkColors() :  this.colors = lightColors()
        this.updateHourstData()
        this.cdr.detectChanges();
      });
    }


}
