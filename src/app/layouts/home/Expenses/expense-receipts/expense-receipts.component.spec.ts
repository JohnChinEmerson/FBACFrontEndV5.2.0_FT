import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReceiptsComponent } from './expense-receipts.component';

describe('ExpenseReceiptsComponent', () => {
  let component: ExpenseReceiptsComponent;
  let fixture: ComponentFixture<ExpenseReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
