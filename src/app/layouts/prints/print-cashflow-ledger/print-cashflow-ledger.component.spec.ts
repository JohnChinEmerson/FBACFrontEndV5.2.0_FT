import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashflowLedgerComponent } from './print-cashflow-ledger.component';

describe('PrintCashflowLedgerComponent', () => {
  let component: PrintCashflowLedgerComponent;
  let fixture: ComponentFixture<PrintCashflowLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashflowLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashflowLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
