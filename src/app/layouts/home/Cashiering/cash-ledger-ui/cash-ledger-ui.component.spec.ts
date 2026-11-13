import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashLedgerUIComponent } from './cash-ledger-ui.component';

describe('CashLedgerUIComponent', () => {
  let component: CashLedgerUIComponent;
  let fixture: ComponentFixture<CashLedgerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashLedgerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashLedgerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
