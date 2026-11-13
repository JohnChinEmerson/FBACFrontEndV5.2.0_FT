import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingMonthlyReportComponent } from './receiving-monthly-report.component';

describe('ReceivingMonthlyReportComponent', () => {
  let component: ReceivingMonthlyReportComponent;
  let fixture: ComponentFixture<ReceivingMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingMonthlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
