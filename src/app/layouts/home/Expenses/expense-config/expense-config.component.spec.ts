import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseConfigComponent } from './expense-config.component';

describe('ExpenseConfigComponent', () => {
  let component: ExpenseConfigComponent;
  let fixture: ComponentFixture<ExpenseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
