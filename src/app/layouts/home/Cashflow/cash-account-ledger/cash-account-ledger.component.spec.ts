import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountLedgerComponent } from './cash-account-ledger.component';

describe('CashAccountLedgerComponent', () => {
  let component: CashAccountLedgerComponent;
  let fixture: ComponentFixture<CashAccountLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashAccountLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashAccountLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
