import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockAdjustmentReportsComponent } from './print-stock-adjustment-reports.component';

describe('PrintStockAdjustmentReportsComponent', () => {
  let component: PrintStockAdjustmentReportsComponent;
  let fixture: ComponentFixture<PrintStockAdjustmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockAdjustmentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockAdjustmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
