import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingVoidReceivingReportComponent } from './receiving-void-receiving-report.component';

describe('ReceivingVoidReceivingReportComponent', () => {
  let component: ReceivingVoidReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingVoidReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingVoidReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingVoidReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
