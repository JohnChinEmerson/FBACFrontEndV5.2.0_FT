import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintYearlyExpensesReportComponent } from './print-yearly-expenses-report.component';

describe('PrintYearlyExpensesReportComponent', () => {
  let component: PrintYearlyExpensesReportComponent;
  let fixture: ComponentFixture<PrintYearlyExpensesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintYearlyExpensesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintYearlyExpensesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
