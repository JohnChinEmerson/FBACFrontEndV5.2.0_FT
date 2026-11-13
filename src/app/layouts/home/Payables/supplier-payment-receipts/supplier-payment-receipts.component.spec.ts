import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentReceiptsComponent } from './supplier-payment-receipts.component';

describe('SupplierPaymentReceiptsComponent', () => {
  let component: SupplierPaymentReceiptsComponent;
  let fixture: ComponentFixture<SupplierPaymentReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
