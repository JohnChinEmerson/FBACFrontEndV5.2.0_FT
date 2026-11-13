import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerSalesReportComponent } from './print-customer-sales-report.component';

describe('PrintCustomerSalesReportComponent', () => {
  let component: PrintCustomerSalesReportComponent;
  let fixture: ComponentFixture<PrintCustomerSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
