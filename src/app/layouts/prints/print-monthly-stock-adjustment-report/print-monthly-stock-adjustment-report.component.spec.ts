import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMonthlyStockAdjustmentReportComponent } from './print-monthly-stock-adjustment-report.component';

describe('PrintMonthlyStockAdjustmentReportComponent', () => {
  let component: PrintMonthlyStockAdjustmentReportComponent;
  let fixture: ComponentFixture<PrintMonthlyStockAdjustmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMonthlyStockAdjustmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMonthlyStockAdjustmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
