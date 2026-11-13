import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierReceivingReportComponent } from './print-supplier-receiving-report.component';

describe('PrintSupplierReceivingReportComponent', () => {
  let component: PrintSupplierReceivingReportComponent;
  let fixture: ComponentFixture<PrintSupplierReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
