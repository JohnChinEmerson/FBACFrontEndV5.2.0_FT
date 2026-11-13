import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeItemsUIComponent } from './barcode-items-ui.component';

describe('BarcodeItemsUIComponent', () => {
  let component: BarcodeItemsUIComponent;
  let fixture: ComponentFixture<BarcodeItemsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeItemsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeItemsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
