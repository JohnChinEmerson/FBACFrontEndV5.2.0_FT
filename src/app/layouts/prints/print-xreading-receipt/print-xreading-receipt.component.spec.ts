import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintXReadingReceiptComponent } from './print-xreading-receipt.component';

describe('PrintXReadingReceiptComponent', () => {
  let component: PrintXReadingReceiptComponent;
  let fixture: ComponentFixture<PrintXReadingReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintXReadingReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintXReadingReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
