import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDailySalesReportComponent } from './print-daily-sales-report.component';

describe('PrintDailySalesReportComponent', () => {
  let component: PrintDailySalesReportComponent;
  let fixture: ComponentFixture<PrintDailySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDailySalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDailySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
