import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisbursementReceiptComponent } from './print-disbursement-receipt.component';

describe('PrintDisbursementReceiptComponent', () => {
  let component: PrintDisbursementReceiptComponent;
  let fixture: ComponentFixture<PrintDisbursementReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDisbursementReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisbursementReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
