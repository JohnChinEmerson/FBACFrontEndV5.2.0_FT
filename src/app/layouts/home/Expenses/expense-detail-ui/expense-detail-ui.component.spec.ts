import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailUIComponent } from './expense-detail-ui.component';

describe('ExpenseDetailUIComponent', () => {
  let component: ExpenseDetailUIComponent;
  let fixture: ComponentFixture<ExpenseDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
