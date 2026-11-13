import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransaction2Component } from './payment-transaction2.component';

describe('PaymentTransaction2Component', () => {
  let component: PaymentTransaction2Component;
  let fixture: ComponentFixture<PaymentTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
