import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTitlesComponent } from './account-titles.component';

describe('AccountTitlesComponent', () => {
  let component: AccountTitlesComponent;
  let fixture: ComponentFixture<AccountTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
