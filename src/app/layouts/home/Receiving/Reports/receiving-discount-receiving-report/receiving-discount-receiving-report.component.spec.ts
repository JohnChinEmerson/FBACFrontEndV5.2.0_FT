import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingDiscountReceivingReportComponent } from './receiving-discount-receiving-report.component';

describe('ReceivingDiscountReceivingReportComponent', () => {
  let component: ReceivingDiscountReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingDiscountReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingDiscountReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingDiscountReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
