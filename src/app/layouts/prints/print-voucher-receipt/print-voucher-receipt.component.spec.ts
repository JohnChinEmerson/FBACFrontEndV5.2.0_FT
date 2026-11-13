import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoucherReceiptComponent } from './print-voucher-receipt.component';

describe('PrintVoucherReceiptComponent', () => {
  let component: PrintVoucherReceiptComponent;
  let fixture: ComponentFixture<PrintVoucherReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVoucherReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVoucherReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
