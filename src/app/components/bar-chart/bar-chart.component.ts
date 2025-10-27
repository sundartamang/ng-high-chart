import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RAW_BAR_DATA } from './data';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, AfterViewInit {
  chartOptions: any;
  Highcharts: typeof Highcharts = Highcharts;

  constructor() {}

  ngOnInit(): void {
    this.initializeChart();
  }

  ngAfterViewInit(): void {}

  private initializeChart(): void {
    const categories = RAW_BAR_DATA.map((item) => item.color);
    const data = RAW_BAR_DATA.map((item) => item.votes);

    this.chartOptions = {
      chart: {
        type: 'column', // vertical bar chart
        backgroundColor: '#f5f5f5',
        scrollablePlotArea: {
          minWidth: categories.length * 50, // 50px per bar
          scrollPositionX: 0, // start at left
        },
      },
      title: {
        text: 'Color Votes Bar Chart',
      },
      xAxis: {
        categories,
        title: { text: 'Colors' },
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
          name: 'Votes',
          type: 'column',
          data: data,
          colorByPoint: false,
          pointWidth: 50,
        },
      ],
      tooltip: {
        pointFormat: 'Votes: <b>{point.y}</b>',
      },
      credits: {
        enabled: false,
      },
    };
  }
}
