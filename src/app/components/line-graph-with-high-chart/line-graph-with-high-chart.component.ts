import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RAW_BAR_DATA } from './data';
import { HighchartsChartModule } from 'highcharts-angular';
import { max } from 'rxjs';

@Component({
  selector: 'app-line-graph-with-high-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './line-graph-with-high-chart.component.html',
  styleUrl: './line-graph-with-high-chart.component.scss',
})
export class LineGraphWithHighChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  barChartData: any;
  chartRef?: Highcharts.Chart;
  highestTick: any;

  constructor() {}

  ngOnInit(): void {
    this.replaceNumberByMaxValue();
    this.initializeChart();
  }

  // Called automatically when the chart is ready
  onChartInstance(chart: Highcharts.Chart): void {
    this.chartRef = chart;
    this.updateBarSeriesData();
  }

  private initializeChart(): void {
    const categories = RAW_BAR_DATA.map((item) => item.color);
    const lineChartData = RAW_BAR_DATA.map((item) => item.votes);
    const updateBarGraphData = this.barChartData.map((item: any) => item.votes);

    const barWidth = 120;
    const barGap = 0;
    const totalBars = categories.length;
    const totalWidth = totalBars * (barWidth + barGap);

    this.chartOptions = {
      chart: {
        backgroundColor: '#f5f5f5',
        scrollablePlotArea: {
          minWidth: totalWidth,
          scrollPositionX: 0,
        },
      },
      title: {
        text: 'Color Votes Combination Chart',
      },
      xAxis: {
        categories,
        labels: {
          rotation: 0,
          style: {
            fontSize: '12px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '50px',
            display: 'block',
          },
          useHTML: true,
        },
      },
      yAxis: {
        min: 0,
        title: { text: 'Votes' },
        allowDecimals: false,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Votes (Bar)',
          type: 'column',
          data: updateBarGraphData,
          color: 'rgba(180, 180, 180, 0.099)',
          borderColor: 'rgba(180, 180, 180, 0.099)',
          pointWidth: barWidth,
          grouping: false,
          groupPadding: 0,
          pointPadding: 0,
          borderWidth: 0,
          enableMouseTracking: false,
          states: {
            hover: { enabled: false },
            inactive: { enabled: false },
          },
          zIndex: 1,
        },
        {
          name: 'Votes (Line)',
          type: 'line',
          data: lineChartData,
          color: '#007bff',
          marker: {
            enabled: true,
            radius: 5,
            lineWidth: 2,
            fillColor: '#007bff',
            enabledThreshold: 0,
          },
          enableMouseTracking: true,
          states: {
            hover: { enabled: false },
          },
          dataLabels: {
            enabled: true,
            formatter: function (this: Highcharts.PointLabelObject) {
              return this.y;
            },
            align: 'center',
            verticalAlign: 'bottom',
            style: {
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#181919ff',
              textOutline: 'none',
            },
          },
          zIndex: 2,
        },
      ],
      tooltip: {
        shared: false,
        pointFormat: '<b>{series.name}</b>: {point.y}<br/>',
      },
      credits: {
        enabled: false,
      },
    };
  }

  private replaceNumberByMaxValue(): void {
    if (!RAW_BAR_DATA || RAW_BAR_DATA.length === 0) {
      throw new Error('RAW_BAR_DATA is empty or undefined.');
    }

    const maxValue = Math.max(...RAW_BAR_DATA.map((d) => d.votes));

    this.barChartData = RAW_BAR_DATA.map((item, index) => ({
      ...item,
      votes: index % 2 === 0 ? 0 : maxValue,
    }));

    // this.barChartData = RAW_BAR_DATA.map(() => maxValue);
  }

  private updateBarSeriesData(): void {
    if (!this.chartRef) return;

    const yAxis = this.chartRef.yAxis[0];
    const tickPositions = yAxis.tickPositions || [];

    if (tickPositions.length) {
      const highestTick = Math.max(...tickPositions);

      const updatedData = this.barChartData.map((item: any, index: any) => ({
        ...item,
        votes: index % 2 === 0 ? 0 : highestTick,
      }));

      // Update the series in the existing chart
      this.chartRef.series[0].setData(
        updatedData.map((d: any) => d.votes),
        true
      );
    }
  }
}
