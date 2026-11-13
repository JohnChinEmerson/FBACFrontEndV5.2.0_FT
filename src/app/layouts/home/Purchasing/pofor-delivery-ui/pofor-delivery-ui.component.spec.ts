import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POForDeliveryUIComponent } from './pofor-delivery-ui.component';

describe('POForDeliveryUIComponent', () => {
  let component: POForDeliveryUIComponent;
  let fixture: ComponentFixture<POForDeliveryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POForDeliveryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POForDeliveryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
