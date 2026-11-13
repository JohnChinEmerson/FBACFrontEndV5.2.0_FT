import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentLedgerComponent } from './stock-adjustment-ledger.component';

describe('StockAdjustmentLedgerComponent', () => {
  let component: StockAdjustmentLedgerComponent;
  let fixture: ComponentFixture<StockAdjustmentLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
