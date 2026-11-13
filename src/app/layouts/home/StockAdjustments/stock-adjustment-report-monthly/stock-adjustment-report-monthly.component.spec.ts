import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentReportMonthlyComponent } from './stock-adjustment-report-monthly.component';

describe('StockAdjustmentReportMonthlyComponent', () => {
  let component: StockAdjustmentReportMonthlyComponent;
  let fixture: ComponentFixture<StockAdjustmentReportMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentReportMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentReportMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
