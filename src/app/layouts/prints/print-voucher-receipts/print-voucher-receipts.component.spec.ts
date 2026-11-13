import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoucherReceiptsComponent } from './print-voucher-receipts.component';

describe('PrintVoucherReceiptsComponent', () => {
  let component: PrintVoucherReceiptsComponent;
  let fixture: ComponentFixture<PrintVoucherReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVoucherReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVoucherReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
