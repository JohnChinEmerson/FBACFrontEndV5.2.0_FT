import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivableOldReceiptComponent } from './print-receivable-old-receipt.component';

describe('PrintReceivableOldReceiptComponent', () => {
  let component: PrintReceivableOldReceiptComponent;
  let fixture: ComponentFixture<PrintReceivableOldReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivableOldReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivableOldReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
