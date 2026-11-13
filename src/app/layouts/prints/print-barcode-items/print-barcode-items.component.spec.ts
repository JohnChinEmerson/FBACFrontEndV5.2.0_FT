import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBarcodeItemsComponent } from './print-barcode-items.component';

describe('PrintBarcodeItemsComponent', () => {
  let component: PrintBarcodeItemsComponent;
  let fixture: ComponentFixture<PrintBarcodeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBarcodeItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBarcodeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
