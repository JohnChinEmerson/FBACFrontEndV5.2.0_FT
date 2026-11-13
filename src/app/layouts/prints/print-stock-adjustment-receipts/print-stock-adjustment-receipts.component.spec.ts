import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockAdjustmentReceiptsComponent } from './print-stock-adjustment-receipts.component';

describe('PrintStockAdjustmentReceiptsComponent', () => {
  let component: PrintStockAdjustmentReceiptsComponent;
  let fixture: ComponentFixture<PrintStockAdjustmentReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockAdjustmentReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockAdjustmentReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
