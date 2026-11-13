import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTitleUIComponent } from './account-title-ui.component';

describe('AccountTitleUIComponent', () => {
  let component: AccountTitleUIComponent;
  let fixture: ComponentFixture<AccountTitleUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTitleUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTitleUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
