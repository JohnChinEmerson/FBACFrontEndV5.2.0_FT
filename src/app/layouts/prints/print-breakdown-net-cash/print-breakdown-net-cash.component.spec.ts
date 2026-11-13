import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBreakdownNetCashComponent } from './print-breakdown-net-cash.component';

describe('PrintBreakdownNetCashComponent', () => {
  let component: PrintBreakdownNetCashComponent;
  let fixture: ComponentFixture<PrintBreakdownNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBreakdownNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBreakdownNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
