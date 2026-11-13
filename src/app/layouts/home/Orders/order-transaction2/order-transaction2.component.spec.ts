import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTransaction2Component } from './order-transaction2.component';

describe('OrderTransaction2Component', () => {
  let component: OrderTransaction2Component;
  let fixture: ComponentFixture<OrderTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
