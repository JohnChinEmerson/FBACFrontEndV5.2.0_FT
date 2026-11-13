import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentReportsComponent } from './supplier-payment-reports.component';

describe('SupplierPaymentReportsComponent', () => {
  let component: SupplierPaymentReportsComponent;
  let fixture: ComponentFixture<SupplierPaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
