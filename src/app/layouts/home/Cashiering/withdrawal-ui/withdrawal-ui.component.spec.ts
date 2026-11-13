import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalUIComponent } from './withdrawal-ui.component';

describe('WithdrawalUIComponent', () => {
  let component: WithdrawalUIComponent;
  let fixture: ComponentFixture<WithdrawalUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
