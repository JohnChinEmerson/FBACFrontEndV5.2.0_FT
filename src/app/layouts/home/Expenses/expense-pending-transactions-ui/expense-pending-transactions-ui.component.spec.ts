import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePendingTransactionsUIComponent } from './expense-pending-transactions-ui.component';

describe('ExpensePendingTransactionsUIComponent', () => {
  let component: ExpensePendingTransactionsUIComponent;
  let fixture: ComponentFixture<ExpensePendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
