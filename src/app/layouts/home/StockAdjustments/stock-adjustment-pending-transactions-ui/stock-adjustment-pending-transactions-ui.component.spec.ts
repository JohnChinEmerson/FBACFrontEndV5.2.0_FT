import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentPendingTransactionsUIComponent } from './stock-adjustment-pending-transactions-ui.component';

describe('StockAdjustmentPendingTransactionsUIComponent', () => {
  let component: StockAdjustmentPendingTransactionsUIComponent;
  let fixture: ComponentFixture<StockAdjustmentPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
