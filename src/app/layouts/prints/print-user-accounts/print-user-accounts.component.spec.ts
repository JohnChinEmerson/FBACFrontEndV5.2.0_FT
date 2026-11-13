import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUserAccountsComponent } from './print-user-accounts.component';

describe('PrintUserAccountsComponent', () => {
  let component: PrintUserAccountsComponent;
  let fixture: ComponentFixture<PrintUserAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintUserAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintUserAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
