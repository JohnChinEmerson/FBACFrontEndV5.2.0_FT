import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsUIComponent } from './order-details-ui.component';

describe('OrderDetailsUIComponent', () => {
  let component: OrderDetailsUIComponent;
  let fixture: ComponentFixture<OrderDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
