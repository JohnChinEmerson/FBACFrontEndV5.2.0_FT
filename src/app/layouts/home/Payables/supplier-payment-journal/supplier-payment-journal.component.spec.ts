import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentJournalComponent } from './supplier-payment-journal.component';

describe('SupplierPaymentJournalComponent', () => {
  let component: SupplierPaymentJournalComponent;
  let fixture: ComponentFixture<SupplierPaymentJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
