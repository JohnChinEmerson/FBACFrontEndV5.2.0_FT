import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMonthlyReceivingReportComponent } from './print-monthly-receiving-report.component';

describe('PrintMonthlyReceivingReportComponent', () => {
  let component: PrintMonthlyReceivingReportComponent;
  let fixture: ComponentFixture<PrintMonthlyReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMonthlyReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMonthlyReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
