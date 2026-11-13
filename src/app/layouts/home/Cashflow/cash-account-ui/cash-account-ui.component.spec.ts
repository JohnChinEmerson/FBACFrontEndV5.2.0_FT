import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountUIComponent } from './cash-account-ui.component';

describe('CashAccountUIComponent', () => {
  let component: CashAccountUIComponent;
  let fixture: ComponentFixture<CashAccountUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashAccountUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashAccountUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
