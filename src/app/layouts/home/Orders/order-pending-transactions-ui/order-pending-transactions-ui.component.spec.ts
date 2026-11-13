import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPendingTransactionsUIComponent } from './order-pending-transactions-ui.component';

describe('OrderPendingTransactionsUIComponent', () => {
  let component: OrderPendingTransactionsUIComponent;
  let fixture: ComponentFixture<OrderPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
