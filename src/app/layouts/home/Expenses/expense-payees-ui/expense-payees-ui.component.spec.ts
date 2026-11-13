import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePayeesUIComponent } from './expense-payees-ui.component';

describe('ExpensePayeesUIComponent', () => {
  let component: ExpensePayeesUIComponent;
  let fixture: ComponentFixture<ExpensePayeesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePayeesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePayeesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
