import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerSaleReturnsComponent } from './print-customer-sale-returns.component';

describe('PrintCustomerSaleReturnsComponent', () => {
  let component: PrintCustomerSaleReturnsComponent;
  let fixture: ComponentFixture<PrintCustomerSaleReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerSaleReturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerSaleReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
