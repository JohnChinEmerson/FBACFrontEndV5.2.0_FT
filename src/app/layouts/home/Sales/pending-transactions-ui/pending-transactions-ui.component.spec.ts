import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTransactionsUIComponent } from './pending-transactions-ui.component';

describe('PendingTransactionsUIComponent', () => {
  let component: PendingTransactionsUIComponent;
  let fixture: ComponentFixture<PendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
