import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeUIComponent } from './barcode-ui.component';

describe('BarcodeUIComponent', () => {
  let component: BarcodeUIComponent;
  let fixture: ComponentFixture<BarcodeUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
