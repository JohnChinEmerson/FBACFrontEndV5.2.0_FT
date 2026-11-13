import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyNetCashComponent } from './monthly-net-cash.component';

describe('MonthlyNetCashComponent', () => {
  let component: MonthlyNetCashComponent;
  let fixture: ComponentFixture<MonthlyNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
