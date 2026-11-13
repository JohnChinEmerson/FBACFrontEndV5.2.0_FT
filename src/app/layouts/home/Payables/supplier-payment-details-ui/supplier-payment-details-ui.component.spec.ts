import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentDetailsUIComponent } from './supplier-payment-details-ui.component';

describe('SupplierPaymentDetailsUIComponent', () => {
  let component: SupplierPaymentDetailsUIComponent;
  let fixture: ComponentFixture<SupplierPaymentDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
