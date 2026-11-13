import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoucherReportsComponent } from './print-voucher-reports.component';

describe('PrintVoucherReportsComponent', () => {
  let component: PrintVoucherReportsComponent;
  let fixture: ComponentFixture<PrintVoucherReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVoucherReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVoucherReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
