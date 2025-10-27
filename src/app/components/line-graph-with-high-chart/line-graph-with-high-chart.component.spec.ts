import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphWithHighChartComponent } from './line-graph-with-high-chart.component';

describe('LineGraphWithHighChartComponent', () => {
  let component: LineGraphWithHighChartComponent;
  let fixture: ComponentFixture<LineGraphWithHighChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineGraphWithHighChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineGraphWithHighChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
