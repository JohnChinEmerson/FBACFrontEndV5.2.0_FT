import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierPaymentReceiptsComponent } from './print-supplier-payment-receipts.component';

describe('PrintSupplierPaymentReceiptsComponent', () => {
  let component: PrintSupplierPaymentReceiptsComponent;
  let fixture: ComponentFixture<PrintSupplierPaymentReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierPaymentReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierPaymentReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
