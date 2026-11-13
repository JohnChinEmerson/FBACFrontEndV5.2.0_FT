import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSaleReturnsReportComponent } from './customer-sale-returns-report.component';

describe('CustomerSaleReturnsReportComponent', () => {
  let component: CustomerSaleReturnsReportComponent;
  let fixture: ComponentFixture<CustomerSaleReturnsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSaleReturnsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSaleReturnsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
