import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownNetCashComponent } from './breakdown-net-cash.component';

describe('BreakdownNetCashComponent', () => {
  let component: BreakdownNetCashComponent;
  let fixture: ComponentFixture<BreakdownNetCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakdownNetCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownNetCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
