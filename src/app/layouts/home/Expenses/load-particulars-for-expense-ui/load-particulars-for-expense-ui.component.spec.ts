import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadParticularsForExpenseUIComponent } from './load-particulars-for-expense-ui.component';

describe('LoadParticularsForExpenseUIComponent', () => {
  let component: LoadParticularsForExpenseUIComponent;
  let fixture: ComponentFixture<LoadParticularsForExpenseUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadParticularsForExpenseUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadParticularsForExpenseUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
