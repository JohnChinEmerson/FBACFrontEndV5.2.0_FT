import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReturnToSupplierReportComponent } from './print-return-to-supplier-report.component';

describe('PrintReturnToSupplierReportComponent', () => {
  let component: PrintReturnToSupplierReportComponent;
  let fixture: ComponentFixture<PrintReturnToSupplierReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReturnToSupplierReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReturnToSupplierReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
