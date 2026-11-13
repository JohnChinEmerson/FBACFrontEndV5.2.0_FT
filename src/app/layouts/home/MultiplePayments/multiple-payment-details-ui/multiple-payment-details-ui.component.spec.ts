import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePaymentDetailsUIComponent } from './multiple-payment-details-ui.component';

describe('MultiplePaymentDetailsUIComponent', () => {
  let component: MultiplePaymentDetailsUIComponent;
  let fixture: ComponentFixture<MultiplePaymentDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePaymentDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePaymentDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
