import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDiscountSalesReportComponent } from './print-discount-sales-report.component';

describe('PrintDiscountSalesReportComponent', () => {
  let component: PrintDiscountSalesReportComponent;
  let fixture: ComponentFixture<PrintDiscountSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDiscountSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDiscountSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
