import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentDetailsComponent } from './print-payment-details.component';

describe('PrintPaymentDetailsComponent', () => {
  let component: PrintPaymentDetailsComponent;
  let fixture: ComponentFixture<PrintPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPaymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
