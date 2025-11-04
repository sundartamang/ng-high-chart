import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'bar-chart',
    loadComponent: () =>
      import('./components/bar-chart/bar-chart.component').then(
        (m) => m.BarChartComponent
      ),
  },
  {
    path: 'horizontal-bar-chart',
    loadComponent: () =>
      import(
        './components/horizontal-bar-chart/horizontal-bar-chart.component'
      ).then((m) => m.HorizontalBarChartComponent),
  },
  {
    path: 'bar-chart-with-line-chart',
    loadComponent: () =>
      import(
        './components/line-graph-with-high-chart/line-graph-with-high-chart.component'
      ).then((m) => m.LineGraphWithHighChartComponent),
  },
  {
    path: 'multiple-line-chart',
    loadComponent: () =>
      import(
        './components/multiple-line-chart/multiple-line-chart.component'
      ).then((m) => m.MultipleLineChartComponent),
  },
];
