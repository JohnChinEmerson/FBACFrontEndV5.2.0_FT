import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDeliveryDetailsComponent } from './print-delivery-details.component';

describe('PrintDeliveryDetailsComponent', () => {
  let component: PrintDeliveryDetailsComponent;
  let fixture: ComponentFixture<PrintDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDeliveryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
