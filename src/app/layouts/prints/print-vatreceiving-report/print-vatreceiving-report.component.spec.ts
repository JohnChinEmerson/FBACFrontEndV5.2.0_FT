import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVATReceivingReportComponent } from './print-vatreceiving-report.component';

describe('PrintVATReceivingReportComponent', () => {
  let component: PrintVATReceivingReportComponent;
  let fixture: ComponentFixture<PrintVATReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVATReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVATReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
