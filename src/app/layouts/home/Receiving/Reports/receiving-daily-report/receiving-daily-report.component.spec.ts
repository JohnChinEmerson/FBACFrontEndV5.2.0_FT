import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingDailyReportComponent } from './receiving-daily-report.component';

describe('ReceivingDailyReportComponent', () => {
  let component: ReceivingDailyReportComponent;
  let fixture: ComponentFixture<ReceivingDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingDailyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
