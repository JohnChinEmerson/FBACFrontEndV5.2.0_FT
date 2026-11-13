import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDailyReceivingReportComponent } from './print-daily-receiving-report.component';

describe('PrintDailyReceivingReportComponent', () => {
  let component: PrintDailyReceivingReportComponent;
  let fixture: ComponentFixture<PrintDailyReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDailyReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDailyReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
