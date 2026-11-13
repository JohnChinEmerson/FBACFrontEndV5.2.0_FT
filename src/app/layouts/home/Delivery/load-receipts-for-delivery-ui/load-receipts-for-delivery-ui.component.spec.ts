import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadReceiptsForDeliveryUIComponent } from './load-receipts-for-delivery-ui.component';

describe('LoadReceiptsForDeliveryUIComponent', () => {
  let component: LoadReceiptsForDeliveryUIComponent;
  let fixture: ComponentFixture<LoadReceiptsForDeliveryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadReceiptsForDeliveryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadReceiptsForDeliveryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
