import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailUIComponent } from './delivery-detail-ui.component';

describe('DeliveryDetailUIComponent', () => {
  let component: DeliveryDetailUIComponent;
  let fixture: ComponentFixture<DeliveryDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
