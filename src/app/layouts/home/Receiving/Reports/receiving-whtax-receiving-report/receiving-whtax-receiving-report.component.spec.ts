import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingWHTaxReceivingReportComponent } from './receiving-whtax-receiving-report.component';

describe('ReceivingWHTaxReceivingReportComponent', () => {
  let component: ReceivingWHTaxReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingWHTaxReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingWHTaxReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingWHTaxReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
