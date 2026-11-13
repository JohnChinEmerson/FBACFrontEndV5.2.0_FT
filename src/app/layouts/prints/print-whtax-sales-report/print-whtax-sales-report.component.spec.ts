import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWHTaxSalesReportComponent } from './print-whtax-sales-report.component';

describe('PrintWHTaxSalesReportComponent', () => {
  let component: PrintWHTaxSalesReportComponent;
  let fixture: ComponentFixture<PrintWHTaxSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintWHTaxSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWHTaxSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
