import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesYearlyReportComponent } from './expenses-yearly-report.component';

describe('ExpensesYearlyReportComponent', () => {
  let component: ExpensesYearlyReportComponent;
  let fixture: ComponentFixture<ExpensesYearlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesYearlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesYearlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
