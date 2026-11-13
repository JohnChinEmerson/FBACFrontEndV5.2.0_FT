import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHeaderUIComponent } from './delivery-header-ui.component';

describe('DeliveryHeaderUIComponent', () => {
  let component: DeliveryHeaderUIComponent;
  let fixture: ComponentFixture<DeliveryHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
