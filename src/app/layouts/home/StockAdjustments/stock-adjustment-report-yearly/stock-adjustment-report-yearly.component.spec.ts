import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentReportYearlyComponent } from './stock-adjustment-report-yearly.component';

describe('StockAdjustmentReportYearlyComponent', () => {
  let component: StockAdjustmentReportYearlyComponent;
  let fixture: ComponentFixture<StockAdjustmentReportYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentReportYearlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentReportYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
