import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashTransferReceiptComponent } from './print-cash-transfer-receipt.component';

describe('PrintCashTransferReceiptComponent', () => {
  let component: PrintCashTransferReceiptComponent;
  let fixture: ComponentFixture<PrintCashTransferReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashTransferReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashTransferReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
