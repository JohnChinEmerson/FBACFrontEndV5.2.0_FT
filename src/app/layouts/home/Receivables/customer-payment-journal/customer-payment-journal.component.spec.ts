import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentJournalComponent } from './customer-payment-journal.component';

describe('CustomerPaymentJournalComponent', () => {
  let component: CustomerPaymentJournalComponent;
  let fixture: ComponentFixture<CustomerPaymentJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPaymentJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
