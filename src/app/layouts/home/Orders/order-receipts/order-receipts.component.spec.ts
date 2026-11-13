import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceiptsComponent } from './order-receipts.component';

describe('OrderReceiptsComponent', () => {
  let component: OrderReceiptsComponent;
  let fixture: ComponentFixture<OrderReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
