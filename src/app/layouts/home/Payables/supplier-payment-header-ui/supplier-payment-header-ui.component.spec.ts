import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentHeaderUIComponent } from './supplier-payment-header-ui.component';

describe('SupplierPaymentHeaderUIComponent', () => {
  let component: SupplierPaymentHeaderUIComponent;
  let fixture: ComponentFixture<SupplierPaymentHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
