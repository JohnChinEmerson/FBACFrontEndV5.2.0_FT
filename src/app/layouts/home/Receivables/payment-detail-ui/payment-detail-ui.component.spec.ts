import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailUIComponent } from './payment-detail-ui.component';

describe('PaymentDetailUIComponent', () => {
  let component: PaymentDetailUIComponent;
  let fixture: ComponentFixture<PaymentDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
