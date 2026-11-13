import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesYearlyReportComponent } from './sales-yearly-report.component';

describe('SalesYearlyReportComponent', () => {
  let component: SalesYearlyReportComponent;
  let fixture: ComponentFixture<SalesYearlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesYearlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesYearlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
