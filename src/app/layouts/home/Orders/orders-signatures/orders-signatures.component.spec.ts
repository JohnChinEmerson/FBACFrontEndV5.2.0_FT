import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSignaturesComponent } from './orders-signatures.component';

describe('OrdersSignaturesComponent', () => {
  let component: OrdersSignaturesComponent;
  let fixture: ComponentFixture<OrdersSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
