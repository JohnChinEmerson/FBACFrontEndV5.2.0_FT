import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailsUIComponent } from './delivery-details-ui.component';

describe('DeliveryDetailsUIComponent', () => {
  let component: DeliveryDetailsUIComponent;
  let fixture: ComponentFixture<DeliveryDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
