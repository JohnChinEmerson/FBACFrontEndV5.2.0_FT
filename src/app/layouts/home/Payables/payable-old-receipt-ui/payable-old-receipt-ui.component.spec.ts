import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableOldReceiptUIComponent } from './payable-old-receipt-ui.component';

describe('PayableOldReceiptUIComponent', () => {
  let component: PayableOldReceiptUIComponent;
  let fixture: ComponentFixture<PayableOldReceiptUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableOldReceiptUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableOldReceiptUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
