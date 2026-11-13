import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentLedgerComponent } from './customer-payment-ledger.component';

describe('CustomerPaymentLedgerComponent', () => {
  let component: CustomerPaymentLedgerComponent;
  let fixture: ComponentFixture<CustomerPaymentLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
