import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransferLedgerComponent } from './cash-transfer-ledger.component';

describe('CashTransferLedgerComponent', () => {
  let component: CashTransferLedgerComponent;
  let fixture: ComponentFixture<CashTransferLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTransferLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashTransferLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
