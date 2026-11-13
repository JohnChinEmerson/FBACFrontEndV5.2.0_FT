import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryConfigComponent } from './delivery-config.component';

describe('DeliveryConfigComponent', () => {
  let component: DeliveryConfigComponent;
  let fixture: ComponentFixture<DeliveryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
