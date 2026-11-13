import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIncomeStatementsComponent } from './print-income-statements.component';

describe('PrintIncomeStatementsComponent', () => {
  let component: PrintIncomeStatementsComponent;
  let fixture: ComponentFixture<PrintIncomeStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintIncomeStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintIncomeStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
