import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMonthlyNetCashComponent } from './print-monthly-net-cash.component';

describe('PrintMonthlyNetCashComponent', () => {
  let component: PrintMonthlyNetCashComponent;
  let fixture: ComponentFixture<PrintMonthlyNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMonthlyNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMonthlyNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
