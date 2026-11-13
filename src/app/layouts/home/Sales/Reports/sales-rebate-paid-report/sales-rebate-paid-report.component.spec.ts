import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRebatePaidReportComponent } from './sales-rebate-paid-report.component';

describe('SalesRebatePaidReportComponent', () => {
  let component: SalesRebatePaidReportComponent;
  let fixture: ComponentFixture<SalesRebatePaidReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRebatePaidReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRebatePaidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
