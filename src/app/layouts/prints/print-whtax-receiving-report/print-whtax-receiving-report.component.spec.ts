import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWHTaxReceivingReportComponent } from './print-whtax-receiving-report.component';

describe('PrintWHTaxReceivingReportComponent', () => {
  let component: PrintWHTaxReceivingReportComponent;
  let fixture: ComponentFixture<PrintWHTaxReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintWHTaxReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWHTaxReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
