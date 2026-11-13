import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintYearlySalesReportComponent } from './print-yearly-sales-report.component';

describe('PrintYearlySalesReportComponent', () => {
  let component: PrintYearlySalesReportComponent;
  let fixture: ComponentFixture<PrintYearlySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintYearlySalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintYearlySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
