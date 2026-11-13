import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerChecksReportComponent } from './print-customer-checks-report.component';

describe('PrintCustomerChecksReportComponent', () => {
  let component: PrintCustomerChecksReportComponent;
  let fixture: ComponentFixture<PrintCustomerChecksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerChecksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerChecksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
