import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordUIComponent } from './change-password-ui.component';

describe('ChangePasswordUIComponent', () => {
  let component: ChangePasswordUIComponent;
  let fixture: ComponentFixture<ChangePasswordUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
