import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseHeaderUIComponent } from './expense-header-ui.component';

describe('ExpenseHeaderUIComponent', () => {
  let component: ExpenseHeaderUIComponent;
  let fixture: ComponentFixture<ExpenseHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
