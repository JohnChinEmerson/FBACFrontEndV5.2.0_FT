import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentReceiptsComponent } from './print-payment-receipts.component';

describe('PrintPaymentReceiptsComponent', () => {
  let component: PrintPaymentReceiptsComponent;
  let fixture: ComponentFixture<PrintPaymentReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPaymentReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaymentReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
