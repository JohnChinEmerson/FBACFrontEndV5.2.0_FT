import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentLedgerComponent } from './supplier-payment-ledger.component';

describe('SupplierPaymentLedgerComponent', () => {
  let component: SupplierPaymentLedgerComponent;
  let fixture: ComponentFixture<SupplierPaymentLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
