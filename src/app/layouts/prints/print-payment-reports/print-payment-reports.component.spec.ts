import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentReportsComponent } from './print-payment-reports.component';

describe('PrintPaymentReportsComponent', () => {
  let component: PrintPaymentReportsComponent;
  let fixture: ComponentFixture<PrintPaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPaymentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
