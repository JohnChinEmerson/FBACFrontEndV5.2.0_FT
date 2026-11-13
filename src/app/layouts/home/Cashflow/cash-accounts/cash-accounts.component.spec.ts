import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAccountsComponent } from './cash-accounts.component';

describe('CashAccountsComponent', () => {
  let component: CashAccountsComponent;
  let fixture: ComponentFixture<CashAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
