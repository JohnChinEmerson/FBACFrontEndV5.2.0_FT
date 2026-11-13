import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRebatePaidSalesReportComponent } from './print-rebate-paid-sales-report.component';

describe('PrintRebatePaidSalesReportComponent', () => {
  let component: PrintRebatePaidSalesReportComponent;
  let fixture: ComponentFixture<PrintRebatePaidSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintRebatePaidSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRebatePaidSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
