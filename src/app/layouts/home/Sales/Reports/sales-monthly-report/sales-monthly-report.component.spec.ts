import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMonthlyReportComponent } from './sales-monthly-report.component';

describe('SalesMonthlyReportComponent', () => {
  let component: SalesMonthlyReportComponent;
  let fixture: ComponentFixture<SalesMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesMonthlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
