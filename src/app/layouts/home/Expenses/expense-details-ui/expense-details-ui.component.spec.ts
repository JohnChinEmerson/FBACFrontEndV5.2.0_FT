import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailsUIComponent } from './expense-details-ui.component';

describe('ExpenseDetailsUIComponent', () => {
  let component: ExpenseDetailsUIComponent;
  let fixture: ComponentFixture<ExpenseDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
