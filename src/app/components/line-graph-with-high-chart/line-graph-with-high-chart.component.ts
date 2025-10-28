import { Component, OnInit } from '@angular/core';
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
        events: {
          render: function (this: Highcharts.Chart) {
            const chart = this;

            // store custom rects
            if (!(chart as any).customCategoryBackgrounds) {
              (chart as any).customCategoryBackgrounds = [];
            }

            // remove old rects
            (chart as any).customCategoryBackgrounds.forEach((rect: any) =>
              rect.destroy()
            );
            (chart as any).customCategoryBackgrounds = [];

            const xAxis = chart.xAxis[0] as any;
            const totalCategories = xAxis.categories?.length || 1;
            const categoryWidth = xAxis.width / totalCategories;

            // Plot area positions
            const plotLeft = chart.plotLeft;
            const plotTop = chart.plotTop;
            const plotHeight = chart.plotHeight;

            // Optional padding below bars / X-axis
            const bottomPadding = 30;

            for (let i = 0; i < totalCategories; i++) {
              const rectX = plotLeft + i * categoryWidth;
              const rectY = plotTop + plotHeight;
              const rectWidth = categoryWidth;
              const rectHeight = bottomPadding;

              const rect = chart.renderer
                .rect(rectX, rectY, rectWidth, rectHeight)
                .attr({
                  fill: 'rgba(200, 230, 255, 0.3)',
                  stroke: '#f5f5f5', // border color
                  'stroke-width': 1, // border thickness
                  zIndex: 0, // behind series
                })
                .add();

              (chart as any).customCategoryBackgrounds.push(rect);
            }

            // Move x-axis labels slightly upward (8px)
            const labelsGroup = (xAxis as any).labelGroup;
            if (labelsGroup && labelsGroup.element) {
              labelsGroup.element
                .querySelectorAll('text')
                .forEach((labelEl: SVGTextElement) => {
                  const currentY = parseFloat(labelEl.getAttribute('y') || '0');
                  labelEl.setAttribute('y', String(currentY - 8));
                });
            }
          },
        },
      },

      title: {
        text: 'Color Votes Combination Chart',
        align: 'left',
        style: { fontWeight: 'bold', fontSize: '14px' },
      },
      xAxis: {
        categories,
        // lineColor: 'rgba(227, 227, 227, 0.3)',
        lineWidth: 0,
        tickLength: 0,
        labels: {
          rotation: 0,
          style: {
            fontSize: '12px',
            textOverflow: 'ellipsis',
          },
          useHTML: false, // keep false since we’re rendering SVG background
        },
      },
      yAxis: {
        min: 0, // always start from 0
        title: { text: 'Votes' },
        allowDecimals: false,
        endOnTick: true, // ensures at least one tick above max
        maxPadding: 0, // optional, adds slight space above the tallest bar
        tickAmount: undefined, // let Highcharts auto decide
        labels: {
          style: {
            fontSize: '11px',
            color: '#444',
          },
        },
      },
      legend: { enabled: false },
      series: [
        {
          name: 'Votes (Bar)',
          type: 'column',
          data: updateBarGraphData,
          color: 'rgba(194, 44, 44, 0.1)',
          borderWidth: 0,
          grouping: false,
          groupPadding: 0,
          pointPadding: 0,
          enableMouseTracking: false,
          states: { hover: { enabled: false }, inactive: { enabled: false } },
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
          states: { hover: { enabled: false } },
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
      credits: { enabled: false },
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
    this.barChartData = RAW_BAR_DATA.map(() => maxValue);
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
