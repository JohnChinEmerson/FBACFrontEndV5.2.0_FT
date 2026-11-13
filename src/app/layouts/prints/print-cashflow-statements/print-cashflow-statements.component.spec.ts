import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashflowStatementsComponent } from './print-cashflow-statements.component';

describe('PrintCashflowStatementsComponent', () => {
  let component: PrintCashflowStatementsComponent;
  let fixture: ComponentFixture<PrintCashflowStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashflowStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashflowStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
