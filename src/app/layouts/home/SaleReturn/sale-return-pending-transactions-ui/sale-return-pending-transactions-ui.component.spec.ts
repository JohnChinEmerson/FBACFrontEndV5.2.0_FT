import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnPendingTransactionsUIComponent } from './sale-return-pending-transactions-ui.component';

describe('SaleReturnPendingTransactionsUIComponent', () => {
  let component: SaleReturnPendingTransactionsUIComponent;
  let fixture: ComponentFixture<SaleReturnPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
