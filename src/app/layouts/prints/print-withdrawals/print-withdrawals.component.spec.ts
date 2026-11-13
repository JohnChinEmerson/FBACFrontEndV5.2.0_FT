import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWithdrawalsComponent } from './print-withdrawals.component';

describe('PrintWithdrawalsComponent', () => {
  let component: PrintWithdrawalsComponent;
  let fixture: ComponentFixture<PrintWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintWithdrawalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
