import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsUIComponent } from './payment-details-ui.component';

describe('PaymentDetailsUIComponent', () => {
  let component: PaymentDetailsUIComponent;
  let fixture: ComponentFixture<PaymentDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
