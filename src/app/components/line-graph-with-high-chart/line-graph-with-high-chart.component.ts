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
      // chart: {
      //   backgroundColor: '#f5f5f5',
      //   scrollablePlotArea: {
      //     minWidth: totalWidth,
      //     scrollPositionX: 0,
      //   },
      //   events: {
      //     render: function (this: Highcharts.Chart) {
      //       const chart = this;

      //       // Store custom rectangles on the chart (using 'any' to bypass TS error)
      //       if (!(chart as any).customLabelBackgrounds) {
      //         (chart as any).customLabelBackgrounds = [];
      //       }

      //       const xAxis = chart.xAxis[0] as any; // cast to 'any' to access private properties
      //       const labelsGroup = xAxis?.labelGroup;

      //       if (!labelsGroup) return;

      //       // Remove previous rectangles
      //       (chart as any).customLabelBackgrounds.forEach((rect: any) =>
      //         rect.destroy()
      //       );
      //       (chart as any).customLabelBackgrounds = [];

      //       // Loop through each label
      //       labelsGroup.element
      //         .querySelectorAll('text')
      //         .forEach((labelEl: any, i: number) => {
      //           const bbox = labelEl.getBBox();

      //           // Draw background rectangle behind label
      //           const rect = chart.renderer
      //             .rect(
      //               bbox.x - 5,
      //               bbox.y - 2,
      //               bbox.width + 10,
      //               bbox.height + 4,
      //               4
      //             )
      //             .attr({
      //               fill: 'rgba(200, 230, 255, 0.6)',
      //               zIndex: -1,
      //             })
      //             .add(labelsGroup);

      //           (chart as any).customLabelBackgrounds.push(rect);
      //         });
      //     },
      //   },
      // },

      // chart: {
      //   backgroundColor: '#f5f5f5',
      //   scrollablePlotArea: {
      //     minWidth: totalWidth,
      //     scrollPositionX: 0,
      //   },
      //   events: {
      //     render: function (this: Highcharts.Chart) {
      //       const chart = this;

      //       if (!(chart as any).customLabelBackgrounds) {
      //         (chart as any).customLabelBackgrounds = [];
      //       }

      //       const xAxis = chart.xAxis[0] as any;
      //       const labelsGroup = xAxis?.labelGroup;
      //       if (!labelsGroup) return;

      //       // Remove old backgrounds
      //       (chart as any).customLabelBackgrounds.forEach((rect: any) =>
      //         rect.destroy()
      //       );
      //       (chart as any).customLabelBackgrounds = [];

      //       // Get category width
      //       const totalCategories = xAxis.categories?.length || 1;
      //       const xStart = xAxis.left; // starting X position of plot area
      //       const xEnd = xAxis.left + xAxis.width;
      //       const categoryWidth = (xEnd - xStart) / totalCategories;

      //       // Loop through each label
      //       labelsGroup.element
      //         .querySelectorAll('text')
      //         .forEach((labelEl: any, i: number) => {
      //           const bbox = labelEl.getBBox();

      //           // Draw rectangle spanning full category width
      //           const rectX = xStart + i * categoryWidth; // left of category
      //           const rectY = bbox.y - 2;
      //           const rectWidth = categoryWidth;
      //           const rectHeight = bbox.height + 4;

      //           const rect = chart.renderer
      //             .rect(rectX, rectY, rectWidth, rectHeight, 4)
      //             .attr({
      //               fill: 'rgba(200, 230, 255, 0.6)',
      //               zIndex: -1,
      //             })
      //             .add(labelsGroup);

      //           (chart as any).customLabelBackgrounds.push(rect);
      //         });
      //     },
      //   },
      // },

      // chart: {
      //   backgroundColor: '#f5f5f5',
      //   scrollablePlotArea: {
      //     minWidth: totalWidth,
      //     scrollPositionX: 0,
      //   },
      //   events: {
      //     render: function (this: Highcharts.Chart) {
      //       const chart = this;

      //       // store custom rects
      //       if (!(chart as any).customCategoryBackgrounds) {
      //         (chart as any).customCategoryBackgrounds = [];
      //       }

      //       // remove old rects
      //       (chart as any).customCategoryBackgrounds.forEach((rect: any) =>
      //         rect.destroy()
      //       );
      //       (chart as any).customCategoryBackgrounds = [];

      //       const xAxis = chart.xAxis[0] as any;
      //       const totalCategories = xAxis.categories?.length || 1;
      //       const categoryWidth = xAxis.width / totalCategories;

      //       // Plot area positions
      //       const plotLeft = chart.plotLeft;
      //       const plotTop = chart.plotTop;
      //       const plotHeight = chart.plotHeight;

      //       // Optional padding below bars / X-axis
      //       const bottomPadding = 30;

      //       for (let i = 0; i < totalCategories; i++) {
      //         const rectX = plotLeft + i * categoryWidth;
      //         const rectY = plotTop + plotHeight; // bottom of plot area
      //         const rectWidth = categoryWidth;
      //         const rectHeight = bottomPadding; // height of background

      //         const rect = chart.renderer
      //           .rect(rectX, rectY, rectWidth, rectHeight)
      //           .attr({
      //             fill: 'rgba(200, 230, 255, 0.3)',
      //             zIndex: 0, // behind all series
      //             borderWidth: 1,
      //           })
      //           .add(); // add to chart renderer

      //         (chart as any).customCategoryBackgrounds.push(rect);
      //       }
      //     },
      //   },
      // },

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

            // Calculate Y position and height to reach chart bottom
            const rectY = chart.plotTop + chart.plotHeight; // start at bottom of plot
            const rectHeight = (chart as any).chartHeight - rectY; // reach bottom of chart

            for (let i = 0; i < totalCategories; i++) {
              const rectX = chart.plotLeft + i * categoryWidth;
              const rectWidth = categoryWidth;

              const rect = chart.renderer
                .rect(rectX, rectY, rectWidth, rectHeight)
                .attr({
                  fill: 'rgba(200, 230, 255, 0.3)',
                  // zIndex: 0, // behind all series
                  stroke: '#f5f5f5', // border color
                  'stroke-width': 1, // border thickness
                  zIndex: 0, // behind series
                })
                .add();

              (chart as any).customCategoryBackgrounds.push(rect);
            }
          },
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
          },
          useHTML: false, // keep false since we’re rendering SVG background
        },
      },
      yAxis: {
        min: 0,
        title: { text: 'Votes' },
        allowDecimals: false,
      },
      legend: { enabled: false },
      series: [
        {
          name: 'Votes (Bar)',
          type: 'column',
          data: updateBarGraphData,
          color: 'rgba(180, 180, 180, 0.099)',
          borderColor: 'rgba(180, 180, 180, 0.099)',
          grouping: false,
          groupPadding: 0,
          pointPadding: 0,
          borderWidth: 2,
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

    // this.chartOptions = {
    //   chart: {
    //     backgroundColor: '#f5f5f5',
    //     scrollablePlotArea: {
    //       minWidth: totalWidth,
    //       scrollPositionX: 0,
    //     },
    //   },
    //   title: {
    //     text: 'Color Votes Combination Chart',
    //   },
    //   xAxis: {
    //     categories,
    //     labels: {
    //       rotation: 0,
    //       style: {
    //         fontSize: '12px',
    //         textOverflow: 'ellipsis',
    //         whiteSpace: 'nowrap',
    //         overflow: 'hidden',
    //         width: '50px',
    //         display: 'block',
    //       },
    //       useHTML: true,
    //     },
    //   },
    //   yAxis: {
    //     min: 0,
    //     title: { text: 'Votes' },
    //     allowDecimals: false,
    //   },
    //   legend: {
    //     enabled: false,
    //   },
    //   series: [
    //     {
    //       name: 'Votes (Bar)',
    //       type: 'column',
    //       data: updateBarGraphData,
    //       color: 'rgba(180, 180, 180, 0.099)',
    //       borderColor: 'rgba(180, 180, 180, 0.099)',
    //       // pointWidth: barWidth,
    //       grouping: false,
    //       groupPadding: 0,
    //       pointPadding: 0,
    //       borderWidth: 2,
    //       enableMouseTracking: false,
    //       states: {
    //         hover: { enabled: false },
    //         inactive: { enabled: false },
    //       },
    //       zIndex: 1,
    //     },
    //     {
    //       name: 'Votes (Line)',
    //       type: 'line',
    //       data: lineChartData,
    //       color: '#007bff',
    //       marker: {
    //         enabled: true,
    //         radius: 5,
    //         lineWidth: 2,
    //         fillColor: '#007bff',
    //         enabledThreshold: 0,
    //       },
    //       enableMouseTracking: true,
    //       states: {
    //         hover: { enabled: false },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (this: Highcharts.PointLabelObject) {
    //           return this.y;
    //         },
    //         align: 'center',
    //         verticalAlign: 'bottom',
    //         style: {
    //           fontSize: '10px',
    //           fontWeight: 'bold',
    //           color: '#181919ff',
    //           textOutline: 'none',
    //         },
    //       },
    //       zIndex: 2,
    //     },
    //   ],
    //   tooltip: {
    //     shared: false,
    //     pointFormat: '<b>{series.name}</b>: {point.y}<br/>',
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    // };
  }

  private replaceNumberByMaxValue(): void {
    if (!RAW_BAR_DATA || RAW_BAR_DATA.length === 0) {
      throw new Error('RAW_BAR_DATA is empty or undefined.');
    }

    const maxValue = Math.max(...RAW_BAR_DATA.map((d) => d.votes));

    // this.barChartData = RAW_BAR_DATA.map((item, index) => ({
    //   ...item,
    //   votes: index % 2 === 0 ? 0 : maxValue,
    // }));

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
