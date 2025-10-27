import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RAW_BAR_DATA } from './data';
import { HighchartsChartModule } from 'highcharts-angular';

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

  constructor() {}

  ngOnInit(): void {
    this.replaceNumberByMaxValue();
    this.initializeChart();
  }

  private initializeChart(): void {
    const categories = RAW_BAR_DATA.map((item) => item.color);
    const lineChartData = RAW_BAR_DATA.map((item) => item.votes);
    const updateBarGraphData = this.barChartData.map((item: any) => item.votes);

    console.log('Line Chart Data:', updateBarGraphData);

    this.chartOptions = {
      chart: {
        backgroundColor: '#f5f5f5', // smoky white
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
            textOverflow: 'ellipsis', // trims the labels
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '50px', // optional: control max label width
            display: 'block',
          },
          useHTML: true, // required for ellipsis to work properly
        },
      },
      yAxis: {
        min: 0,
        title: { text: 'Votes' },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Votes (Bar)',
          type: 'column', // vertical bar
          data: updateBarGraphData,
          color: 'rgba(180, 180, 180, 0.099)',
          borderColor: 'rgba(180, 180, 180, 0.099)',
          pointWidth: 75,
          enableMouseTracking: false,
          states: {
            hover: { enabled: false },
            inactive: { enabled: false },
          },
        },
        {
          name: 'Votes (Line)',
          type: 'line', // line chart on same axis
          data: lineChartData,
          color: '#007bff',
          marker: {
            enabled: true,
            radius: 4,
          },
          enableMouseTracking: true,
        },
      ],
      tooltip: {
        shared: false, // show both bar and line values on hover
        pointFormat: '<b>{series.name}</b>: {point.y}<br/>',
      },
      credits: {
        enabled: false,
      },
    };
  }

  private replaceNumberByMaxValue() {
    if (!RAW_BAR_DATA || RAW_BAR_DATA.length === 0) {
      throw new Error('RAW_BAR_DATA is empty or undefined.');
    }

    const maxValue = Math.max(...RAW_BAR_DATA.map((item: any) => item.votes));

    // keep same structure as RAW_BAR_DATA
    this.barChartData = RAW_BAR_DATA.map((item, index) => ({
      ...item,
      votes: index % 2 === 0 ? 0 : maxValue,
    }));
  }
}
