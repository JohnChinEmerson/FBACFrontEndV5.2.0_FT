import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashAccountLedgerComponent } from './print-cash-account-ledger.component';

describe('PrintCashAccountLedgerComponent', () => {
  let component: PrintCashAccountLedgerComponent;
  let fixture: ComponentFixture<PrintCashAccountLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashAccountLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashAccountLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
