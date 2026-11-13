import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingVATReceivingReportComponent } from './receiving-vatreceiving-report.component';

describe('ReceivingVATReceivingReportComponent', () => {
  let component: ReceivingVATReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingVATReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingVATReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingVATReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
