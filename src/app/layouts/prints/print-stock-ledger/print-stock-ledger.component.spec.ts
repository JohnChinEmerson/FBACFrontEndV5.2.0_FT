import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockLedgerComponent } from './print-stock-ledger.component';

describe('PrintStockLedgerComponent', () => {
  let component: PrintStockLedgerComponent;
  let fixture: ComponentFixture<PrintStockLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
