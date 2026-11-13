import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadReceiptsForSupplierPaymentUIComponent } from './load-receipts-for-supplier-payment-ui.component';

describe('LoadReceiptsForSupplierPaymentUIComponent', () => {
  let component: LoadReceiptsForSupplierPaymentUIComponent;
  let fixture: ComponentFixture<LoadReceiptsForSupplierPaymentUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadReceiptsForSupplierPaymentUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadReceiptsForSupplierPaymentUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
