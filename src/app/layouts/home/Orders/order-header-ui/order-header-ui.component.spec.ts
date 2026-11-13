import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderUIComponent } from './order-header-ui.component';

describe('OrderHeaderUIComponent', () => {
  let component: OrderHeaderUIComponent;
  let fixture: ComponentFixture<OrderHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
