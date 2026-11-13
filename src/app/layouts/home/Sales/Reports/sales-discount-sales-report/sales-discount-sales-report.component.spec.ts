import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDiscountSalesReportComponent } from './sales-discount-sales-report.component';

describe('SalesDiscountSalesReportComponent', () => {
  let component: SalesDiscountSalesReportComponent;
  let fixture: ComponentFixture<SalesDiscountSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDiscountSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDiscountSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
