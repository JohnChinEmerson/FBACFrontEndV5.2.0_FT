import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDiscountReceivingReportComponent } from './print-discount-receiving-report.component';

describe('PrintDiscountReceivingReportComponent', () => {
  let component: PrintDiscountReceivingReportComponent;
  let fixture: ComponentFixture<PrintDiscountReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDiscountReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDiscountReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
