import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDailyStockAdjustmentReportComponent } from './print-daily-stock-adjustment-report.component';

describe('PrintDailyStockAdjustmentReportComponent', () => {
  let component: PrintDailyStockAdjustmentReportComponent;
  let fixture: ComponentFixture<PrintDailyStockAdjustmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDailyStockAdjustmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDailyStockAdjustmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
