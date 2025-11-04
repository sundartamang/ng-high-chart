import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RAW_BAR_DATA } from './data';
import { HighchartsChartModule } from 'highcharts-angular';
@Component({
  selector: 'app-multiple-line-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './multiple-line-chart.component.html',
  styleUrl: './multiple-line-chart.component.scss',
})
export class MultipleLineChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  allData: any;
  chartRef?: Highcharts.Chart;
  barGraphData: any;
  maxDataLengthOfYears: any;

  ngOnInit(): void {
    this.allData = RAW_BAR_DATA;
    this.determineMaxLengthOfYears();
    this.replaceNumberByMaxValue();
    this.initializeChart();
  }

  private initializeChart(): void {
    const documents = this.allData.documents;
    const allEmpty = Object.values(documents).every(
      (yearData: any) => (yearData as any[]).length === 0
    );

    if (allEmpty) {
      console.log('All years are empty');
      return;
    }

    const lineChatSeries = this.createLineChartSeries(documents);

    const barChart = this.createShadowBarChart();

    const xCategories = Array.from(
      { length: this.maxDataLengthOfYears },
      (_, i) => i + 1
    );

    const barWidth = 120;
    const barGap = 0;
    const totalBars = xCategories.length;
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
        text: 'Votes per Year',
      },
      xAxis: {
        categories: xCategories.map(String),
        title: { text: '' },
      },
      yAxis: {
        title: { text: 'Votes' },
        allowDecimals: false,
        endOnTick: true,
        max: Math.max(
          ...Object.values(this.allData.documents)
            .flat()
            .map((d: any) => d.votes)
        ),
      },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          const point = this.point as Highcharts.Point & { custom?: any };
          const year = this.series.name;
          const votes = point.y;
          const colorName = point.custom?.colorName || 'Unknown';
          return `
            <div style="padding:4px 8px;">
              <b>Year </b>: ${year}<br/>
              <b>Votes </b>: ${votes}<br/>
              <b>Color Name</b>: ${colorName}
            </div>
          `;
        },
      },

      series: [...lineChatSeries, barChart],
      credits: { enabled: false },
    };
  }

  private replaceNumberByMaxValue(): void {
    if (!this.allData || !this.allData.documents) {
      throw new Error('Data is empty or undefined.');
    }

    // Get the maximum votes across all years
    const allVotes = Object.values(this.allData.documents)
      .flat()
      .map((item: any) => item.votes);
    const maxVotes = Math.max(...allVotes);
    console.log('maxVotes => ', maxVotes);

    // Generate bar graph data up to maxDataLengthOfYears
    this.barGraphData = Array.from(
      { length: this.maxDataLengthOfYears },
      (_, i) => (i % 2 === 0 ? maxVotes : 0)
    );

    console.log('barGraphData => ', this.barGraphData);
  }

  private determineMaxLengthOfYears(): void {
    const documents = this.allData.documents;
    this.maxDataLengthOfYears = Math.max(
      ...Object.values(documents).map((data: any) => (data as any[]).length)
    );
  }

  private createLineChartSeries(
    documents: any[]
  ): Highcharts.SeriesOptionsType[] {
    const lineChatSeries: Highcharts.SeriesOptionsType[] = Object.entries(
      documents
    )
      .filter(([_, yearData]) => (yearData as any[]).length > 0)
      .map(([year, yearData], index) => {
        const dataPoints = (yearData as any[]).map((item) => ({
          y: item.votes,
          custom: { colorName: item.color },
        }));

        return {
          name: `${year}`,
          type: 'line',
          data: dataPoints,
          marker: {
            enabled: true,
            radius: 5,
            lineWidth: 2,
            enabledThreshold: 0,
          },
          states: {
            hover: { enabled: false },
            inactive: { enabled: false },
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
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
          },
          color: Highcharts.getOptions().colors?.[index],
        } as Highcharts.SeriesLineOptions;
      });
    return lineChatSeries;
  }

  private createShadowBarChart(): Highcharts.SeriesOptionsType {
    const shadowBarSeries: Highcharts.SeriesColumnOptions = {
      type: 'column',
      data: this.barGraphData,
      color: 'rgba(0, 0, 0, 0.03)',
      borderWidth: 0,
      grouping: false,
      groupPadding: 0,
      pointPadding: 0,
      enableMouseTracking: false,
      states: { hover: { enabled: false }, inactive: { enabled: false } },
      zIndex: 0,
      showInLegend: false,
    };
    return shadowBarSeries;
  }
}
