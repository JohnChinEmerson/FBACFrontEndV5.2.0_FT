import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintExpenseReceiptsComponent } from './print-expense-receipts.component';

describe('PrintExpenseReceiptsComponent', () => {
  let component: PrintExpenseReceiptsComponent;
  let fixture: ComponentFixture<PrintExpenseReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintExpenseReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintExpenseReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
