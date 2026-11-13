import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierPendingTransactionsUIComponent } from './return-to-supplier-pending-transactions-ui.component';

describe('ReturnToSupplierPendingTransactionsUIComponent', () => {
  let component: ReturnToSupplierPendingTransactionsUIComponent;
  let fixture: ComponentFixture<ReturnToSupplierPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
