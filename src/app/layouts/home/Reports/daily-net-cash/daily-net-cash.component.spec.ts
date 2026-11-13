import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyNetCashComponent } from './daily-net-cash.component';

describe('DailyNetCashComponent', () => {
  let component: DailyNetCashComponent;
  let fixture: ComponentFixture<DailyNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
