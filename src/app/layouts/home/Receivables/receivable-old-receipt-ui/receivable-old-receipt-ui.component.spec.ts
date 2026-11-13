import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableOldReceiptUIComponent } from './receivable-old-receipt-ui.component';

describe('ReceivableOldReceiptUIComponent', () => {
  let component: ReceivableOldReceiptUIComponent;
  let fixture: ComponentFixture<ReceivableOldReceiptUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableOldReceiptUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableOldReceiptUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
