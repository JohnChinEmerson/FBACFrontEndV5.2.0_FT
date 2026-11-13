import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingYearlyReportComponent } from './receiving-yearly-report.component';

describe('ReceivingYearlyReportComponent', () => {
  let component: ReceivingYearlyReportComponent;
  let fixture: ComponentFixture<ReceivingYearlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingYearlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingYearlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
