import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintExpenseDetailsComponent } from './print-expense-details.component';

describe('PrintExpenseDetailsComponent', () => {
  let component: PrintExpenseDetailsComponent;
  let fixture: ComponentFixture<PrintExpenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintExpenseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
