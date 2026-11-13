import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockAdjustmentDetailsComponent } from './print-stock-adjustment-details.component';

describe('PrintStockAdjustmentDetailsComponent', () => {
  let component: PrintStockAdjustmentDetailsComponent;
  let fixture: ComponentFixture<PrintStockAdjustmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockAdjustmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockAdjustmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
