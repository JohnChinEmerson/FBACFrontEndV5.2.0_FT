import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingPendingTransactionsUIComponent } from './receiving-pending-transactions-ui.component';

describe('ReceivingPendingTransactionsUIComponent', () => {
  let component: ReceivingPendingTransactionsUIComponent;
  let fixture: ComponentFixture<ReceivingPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
