import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierLedgerComponent } from './print-supplier-ledger.component';

describe('PrintSupplierLedgerComponent', () => {
  let component: PrintSupplierLedgerComponent;
  let fixture: ComponentFixture<PrintSupplierLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
