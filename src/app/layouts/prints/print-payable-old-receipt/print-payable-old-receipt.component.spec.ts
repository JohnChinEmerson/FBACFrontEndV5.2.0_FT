import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPayableOldReceiptComponent } from './print-payable-old-receipt.component';

describe('PrintPayableOldReceiptComponent', () => {
  let component: PrintPayableOldReceiptComponent;
  let fixture: ComponentFixture<PrintPayableOldReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPayableOldReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPayableOldReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
