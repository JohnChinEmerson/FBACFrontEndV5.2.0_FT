import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCustomerSalesReportComponent } from './sales-customer-sales-report.component';

describe('SalesCustomerSalesReportComponent', () => {
  let component: SalesCustomerSalesReportComponent;
  let fixture: ComponentFixture<SalesCustomerSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesCustomerSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCustomerSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
