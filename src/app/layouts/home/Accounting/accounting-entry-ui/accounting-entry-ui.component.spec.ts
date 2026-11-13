import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEntryUIComponent } from './accounting-entry-ui.component';

describe('AccountingEntryUIComponent', () => {
  let component: AccountingEntryUIComponent;
  let fixture: ComponentFixture<AccountingEntryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingEntryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEntryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
