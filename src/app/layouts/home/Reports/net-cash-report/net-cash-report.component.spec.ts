import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetCashReportComponent } from './net-cash-report.component';

describe('NetCashReportComponent', () => {
  let component: NetCashReportComponent;
  let fixture: ComponentFixture<NetCashReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetCashReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetCashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
