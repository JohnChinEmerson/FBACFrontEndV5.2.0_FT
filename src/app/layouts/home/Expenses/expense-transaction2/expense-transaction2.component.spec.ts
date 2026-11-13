import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTransaction2Component } from './expense-transaction2.component';

describe('ExpenseTransaction2Component', () => {
  let component: ExpenseTransaction2Component;
  let fixture: ComponentFixture<ExpenseTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
