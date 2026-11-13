import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintZReadingReceiptComponent } from './print-zreading-receipt.component';

describe('PrintZReadingReceiptComponent', () => {
  let component: PrintZReadingReceiptComponent;
  let fixture: ComponentFixture<PrintZReadingReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintZReadingReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintZReadingReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
