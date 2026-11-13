import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesDateRangeReportComponent } from './expenses-date-range-report.component';

describe('ExpensesDateRangeReportComponent', () => {
  let component: ExpensesDateRangeReportComponent;
  let fixture: ComponentFixture<ExpensesDateRangeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesDateRangeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesDateRangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
