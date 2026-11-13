import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePayeeUIComponent } from './expense-payee-ui.component';

describe('ExpensePayeeUIComponent', () => {
  let component: ExpensePayeeUIComponent;
  let fixture: ComponentFixture<ExpensePayeeUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePayeeUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePayeeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
