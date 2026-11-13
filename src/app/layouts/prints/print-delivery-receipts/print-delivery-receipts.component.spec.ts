import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDeliveryReceiptsComponent } from './print-delivery-receipts.component';

describe('PrintDeliveryReceiptsComponent', () => {
  let component: PrintDeliveryReceiptsComponent;
  let fixture: ComponentFixture<PrintDeliveryReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDeliveryReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDeliveryReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
