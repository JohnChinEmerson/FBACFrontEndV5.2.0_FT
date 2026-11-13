import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWithdrawalReceiptComponent } from './print-withdrawal-receipt.component';

describe('PrintWithdrawalReceiptComponent', () => {
  let component: PrintWithdrawalReceiptComponent;
  let fixture: ComponentFixture<PrintWithdrawalReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintWithdrawalReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWithdrawalReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
