import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowStatementsComponent } from './cashflow-statements.component';

describe('CashflowStatementsComponent', () => {
  let component: CashflowStatementsComponent;
  let fixture: ComponentFixture<CashflowStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashflowStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
