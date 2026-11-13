import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalsUIComponent } from './withdrawals-ui.component';

describe('WithdrawalsUIComponent', () => {
  let component: WithdrawalsUIComponent;
  let fixture: ComponentFixture<WithdrawalsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
