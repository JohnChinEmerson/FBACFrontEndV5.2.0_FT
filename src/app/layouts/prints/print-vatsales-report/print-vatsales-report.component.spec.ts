import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVATSalesReportComponent } from './print-vatsales-report.component';

describe('PrintVATSalesReportComponent', () => {
  let component: PrintVATSalesReportComponent;
  let fixture: ComponentFixture<PrintVATSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVATSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVATSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
