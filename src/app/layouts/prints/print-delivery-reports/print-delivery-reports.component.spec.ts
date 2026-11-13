import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDeliveryReportsComponent } from './print-delivery-reports.component';

describe('PrintDeliveryReportsComponent', () => {
  let component: PrintDeliveryReportsComponent;
  let fixture: ComponentFixture<PrintDeliveryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDeliveryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDeliveryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
