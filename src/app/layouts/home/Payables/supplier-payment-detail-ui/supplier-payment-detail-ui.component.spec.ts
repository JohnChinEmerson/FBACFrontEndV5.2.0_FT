import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentDetailUIComponent } from './supplier-payment-detail-ui.component';

describe('SupplierPaymentDetailUIComponent', () => {
  let component: SupplierPaymentDetailUIComponent;
  let fixture: ComponentFixture<SupplierPaymentDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
