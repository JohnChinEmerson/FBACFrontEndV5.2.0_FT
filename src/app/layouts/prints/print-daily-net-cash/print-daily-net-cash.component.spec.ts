import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDailyNetCashComponent } from './print-daily-net-cash.component';

describe('PrintDailyNetCashComponent', () => {
  let component: PrintDailyNetCashComponent;
  let fixture: ComponentFixture<PrintDailyNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDailyNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDailyNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
