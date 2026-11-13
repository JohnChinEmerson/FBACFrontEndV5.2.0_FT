import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashierLedgersComponent } from './print-cashier-ledgers.component';

describe('PrintCashierLedgersComponent', () => {
  let component: PrintCashierLedgersComponent;
  let fixture: ComponentFixture<PrintCashierLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashierLedgersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashierLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
