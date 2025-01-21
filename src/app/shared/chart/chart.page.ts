import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartOptions, ChartData, ChartType, Chart } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChartPage implements OnChanges {

  @Input() chartType!: ChartType
  @Input() chartLabels: string[] = [];
  @Input() chartData: ChartData<'pie' | 'bar' | 'line'> = { datasets: [] };
  @Input() chartOptions: ChartOptions = {};

  private chart!: Chart;

  constructor(
    private cdr: ChangeDetectorRef
  ){}



  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      if (changes['chartData'] || changes['chartLabels'] || changes['chartType']) {
        this.chart.data = {
          labels: this.chartLabels,
          datasets: this.chartData.datasets || [],
        };
        this.chart.update(); // Efficiently update the chart
      }

      if (changes['chartOptions']) {
        this.chart.options = this.chartOptions;
        this.chart.update();
      }
    } else {
      setTimeout(() => {
        this.initializeChart();
      }, 500)
      this.cdr.detectChanges();
    }
  }

  private initializeChart(): void {
    this.chart = new Chart('sale-canvas', {
      type: this.chartType,
      data: {
        datasets: this.chartData.datasets || [],
      },
      options: this.chartOptions
    });

  }


}
