import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForDeliveryUIComponent } from './load-items-for-delivery-ui.component';

describe('LoadItemsForDeliveryUIComponent', () => {
  let component: LoadItemsForDeliveryUIComponent;
  let fixture: ComponentFixture<LoadItemsForDeliveryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForDeliveryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForDeliveryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
