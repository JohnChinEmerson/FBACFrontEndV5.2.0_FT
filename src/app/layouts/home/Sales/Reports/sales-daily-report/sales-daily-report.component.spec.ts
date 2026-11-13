import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDailyReportComponent } from './sales-daily-report.component';

describe('SalesDailyReportComponent', () => {
  let component: SalesDailyReportComponent;
  let fixture: ComponentFixture<SalesDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDailyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
