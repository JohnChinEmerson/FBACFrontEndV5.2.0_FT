import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerLedgerComponent } from './print-customer-ledger.component';

describe('PrintCustomerLedgerComponent', () => {
  let component: PrintCustomerLedgerComponent;
  let fixture: ComponentFixture<PrintCustomerLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
