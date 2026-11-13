import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTransaction2Component } from './delivery-transaction2.component';

describe('DeliveryTransaction2Component', () => {
  let component: DeliveryTransaction2Component;
  let fixture: ComponentFixture<DeliveryTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
