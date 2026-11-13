import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailUIComponent } from './order-detail-ui.component';

describe('OrderDetailUIComponent', () => {
  let component: OrderDetailUIComponent;
  let fixture: ComponentFixture<OrderDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
