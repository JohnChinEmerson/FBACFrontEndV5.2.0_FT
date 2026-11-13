import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUIComponent } from './password-ui.component';

describe('PasswordUIComponent', () => {
  let component: PasswordUIComponent;
  let fixture: ComponentFixture<PasswordUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
