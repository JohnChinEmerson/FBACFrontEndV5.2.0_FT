import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMonthlySalesReportComponent } from './print-monthly-sales-report.component';

describe('PrintMonthlySalesReportComponent', () => {
  let component: PrintMonthlySalesReportComponent;
  let fixture: ComponentFixture<PrintMonthlySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMonthlySalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMonthlySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
