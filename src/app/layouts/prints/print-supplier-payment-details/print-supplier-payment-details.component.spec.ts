import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierPaymentDetailsComponent } from './print-supplier-payment-details.component';

describe('PrintSupplierPaymentDetailsComponent', () => {
  let component: PrintSupplierPaymentDetailsComponent;
  let fixture: ComponentFixture<PrintSupplierPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierPaymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
