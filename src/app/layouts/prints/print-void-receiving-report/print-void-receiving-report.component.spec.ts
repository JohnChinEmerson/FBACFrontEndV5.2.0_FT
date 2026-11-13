import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoidReceivingReportComponent } from './print-void-receiving-report.component';

describe('PrintVoidReceivingReportComponent', () => {
  let component: PrintVoidReceivingReportComponent;
  let fixture: ComponentFixture<PrintVoidReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVoidReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVoidReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
