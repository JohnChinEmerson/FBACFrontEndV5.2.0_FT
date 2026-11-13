import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPettyCashDetailsReceiptComponent } from './print-petty-cash-details-receipt.component';

describe('PrintPettyCashDetailsReceiptComponent', () => {
  let component: PrintPettyCashDetailsReceiptComponent;
  let fixture: ComponentFixture<PrintPettyCashDetailsReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPettyCashDetailsReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPettyCashDetailsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
