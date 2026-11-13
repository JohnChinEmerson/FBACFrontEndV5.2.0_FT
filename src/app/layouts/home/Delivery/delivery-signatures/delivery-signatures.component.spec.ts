import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySignaturesComponent } from './delivery-signatures.component';

describe('DeliverySignaturesComponent', () => {
  let component: DeliverySignaturesComponent;
  let fixture: ComponentFixture<DeliverySignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverySignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverySignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
