import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMonthlyExpensesReportComponent } from './print-monthly-expenses-report.component';

describe('PrintMonthlyExpensesReportComponent', () => {
  let component: PrintMonthlyExpensesReportComponent;
  let fixture: ComponentFixture<PrintMonthlyExpensesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMonthlyExpensesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMonthlyExpensesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
