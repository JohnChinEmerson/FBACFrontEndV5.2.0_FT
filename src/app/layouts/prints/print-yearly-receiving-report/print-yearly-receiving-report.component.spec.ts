import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintYearlyReceivingReportComponent } from './print-yearly-receiving-report.component';

describe('PrintYearlyReceivingReportComponent', () => {
  let component: PrintYearlyReceivingReportComponent;
  let fixture: ComponentFixture<PrintYearlyReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintYearlyReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintYearlyReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
