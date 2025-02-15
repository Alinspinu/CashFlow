import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { colors, darkColors, lightColors } from 'src/app/shared/chart/chart.colors';
import { chartDay } from '../fin-chart.page';
import { roundOne } from '../../../../shared/utils/functions';


Chart.register(ChartDataLabels);

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalPage implements OnInit {

  private chart!: Chart;

    private colors: colors = lightColors()

    chartDay!: chartDay

  constructor(
    private cdr: ChangeDetectorRef,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    const data = this.navParams.get('options') as chartDay
    if(data) {
      this.chartDay = data
      console.group(this.chartDay)
      setTimeout(() => {
        this.getColors()
      }, 500)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }



  updateChartData(){
    const labels = ['Profit', 'Ingrediente','Cheltuieli', 'Angajați', 'Deprecieri']
    const values = [
      roundOne(this.chartDay.profit > 0 ? this.chartDay.profit : 0),
      roundOne(this.chartDay.ingsValue),
      roundOne(this.chartDay.spendings),
      roundOne(this.chartDay.workValue),
      roundOne(this.chartDay.deps),
    ]
    const colors = [
      this.colors.green,
      this.colors.lightBlue,
      this.colors.turqoise,
      this.colors.sand,
      this.colors.red,
    ]
    const contrast = [
      this.colors.greenContrast,
      this.colors.blueContrast,
      this.colors.turqoiseContrast,
      this.colors.sandContrast,
      this.colors.redContrast,
      ]
    const chartData = {
      labels: labels,
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
    const  chartOptions = {
      responsive: true,
      animation: {
        duration: 600,
        easing: 'easeInOutQuad' as 'easeInOutQuad',
      },
        plugins: {
          legend: {
            display: true,
            position: 'right' as 'right',
            labels: {
              color: this.colors.medium,
              font: {
                size: 16,
                family: 'RoseLight',
              }
            }
          },
          tooltip: {
            enabled: false
          },
          title: {
            display: false,
          },
          datalabels: {
            color: this.colors.medium,
            font: {
              size: 16,
              family: 'RoseMed',
            },
            formatter: (value: any, context: any) => {
              const total = context.chart.data.datasets[0].data.reduce((acc:any, curr: any) => {
                const a = typeof acc === 'number' ? acc : 0;
                const b = typeof curr === 'number' ? curr : 0;
                return a + b;
              }, 0);

              if (typeof total === 'number' && value > total * 0.05) {
                return `${value} Lei`;
              }
              return '';
            },
            anchor: 'center' as 'center',
            align: 'top' as 'top',
          }
        }
    }
    if(this.chart){
      this.chart.data = chartData,
      this.chart.options = chartOptions,
      this.chart.update()
    } else {
      this.chart =  new Chart('canvas', {
        type: 'pie',
        data: chartData,
        options: chartOptions,
        plugins: [ChartDataLabels]
      });
    }
  }





    getColors(){
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.matches ? this.colors = darkColors() : this.colors = lightColors()
      this.updateChartData()
      this.cdr.detectChanges();
      prefersDark.addListener((mediaQuery) => {
        prefersDark.matches ?  this.colors = darkColors() :  this.colors = lightColors()
        this.updateChartData()
        this.cdr.detectChanges();
      });
    }

}
