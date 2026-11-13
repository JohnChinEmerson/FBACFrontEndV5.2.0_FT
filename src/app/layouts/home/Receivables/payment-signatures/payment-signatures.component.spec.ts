import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSignaturesComponent } from './payment-signatures.component';

describe('PaymentSignaturesComponent', () => {
  let component: PaymentSignaturesComponent;
  let fixture: ComponentFixture<PaymentSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
