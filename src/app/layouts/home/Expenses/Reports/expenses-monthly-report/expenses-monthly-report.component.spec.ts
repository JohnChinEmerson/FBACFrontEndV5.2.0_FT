import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesMonthlyReportComponent } from './expenses-monthly-report.component';

describe('ExpensesMonthlyReportComponent', () => {
  let component: ExpensesMonthlyReportComponent;
  let fixture: ComponentFixture<ExpensesMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesMonthlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
