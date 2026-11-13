import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowLedgerComponent } from './cashflow-ledger.component';

describe('CashflowLedgerComponent', () => {
  let component: CashflowLedgerComponent;
  let fixture: ComponentFixture<CashflowLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashflowLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
