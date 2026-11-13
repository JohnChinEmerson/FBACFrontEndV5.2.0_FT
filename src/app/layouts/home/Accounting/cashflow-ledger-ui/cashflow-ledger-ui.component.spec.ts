import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowLedgerUIComponent } from './cashflow-ledger-ui.component';

describe('CashflowLedgerUIComponent', () => {
  let component: CashflowLedgerUIComponent;
  let fixture: ComponentFixture<CashflowLedgerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashflowLedgerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowLedgerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
