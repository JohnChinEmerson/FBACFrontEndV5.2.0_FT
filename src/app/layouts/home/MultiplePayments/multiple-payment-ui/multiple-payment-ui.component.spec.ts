import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePaymentUIComponent } from './multiple-payment-ui.component';

describe('MultiplePaymentUIComponent', () => {
  let component: MultiplePaymentUIComponent;
  let fixture: ComponentFixture<MultiplePaymentUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePaymentUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePaymentUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
