import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingSupplierReceivingReportComponent } from './receiving-supplier-receiving-report.component';

describe('ReceivingSupplierReceivingReportComponent', () => {
  let component: ReceivingSupplierReceivingReportComponent;
  let fixture: ComponentFixture<ReceivingSupplierReceivingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingSupplierReceivingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingSupplierReceivingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
