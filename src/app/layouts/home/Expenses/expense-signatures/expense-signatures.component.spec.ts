import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSignaturesComponent } from './expense-signatures.component';

describe('ExpenseSignaturesComponent', () => {
  let component: ExpenseSignaturesComponent;
  let fixture: ComponentFixture<ExpenseSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
