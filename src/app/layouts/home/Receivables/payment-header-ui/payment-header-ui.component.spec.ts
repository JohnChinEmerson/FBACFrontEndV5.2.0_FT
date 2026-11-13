import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHeaderUIComponent } from './payment-header-ui.component';

describe('PaymentHeaderUIComponent', () => {
  let component: PaymentHeaderUIComponent;
  let fixture: ComponentFixture<PaymentHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
