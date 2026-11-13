import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentReportDailyComponent } from './stock-adjustment-report-daily.component';

describe('StockAdjustmentReportDailyComponent', () => {
  let component: StockAdjustmentReportDailyComponent;
  let fixture: ComponentFixture<StockAdjustmentReportDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentReportDailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentReportDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
