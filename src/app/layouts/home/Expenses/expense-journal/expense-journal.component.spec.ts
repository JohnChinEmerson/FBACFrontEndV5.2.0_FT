import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseJournalComponent } from './expense-journal.component';

describe('ExpenseJournalComponent', () => {
  let component: ExpenseJournalComponent;
  let fixture: ComponentFixture<ExpenseJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
