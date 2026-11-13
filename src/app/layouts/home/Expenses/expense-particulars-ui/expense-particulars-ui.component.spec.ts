import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseParticularsUIComponent } from './expense-particulars-ui.component';

describe('ExpenseParticularsUIComponent', () => {
  let component: ExpenseParticularsUIComponent;
  let fixture: ComponentFixture<ExpenseParticularsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseParticularsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseParticularsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
