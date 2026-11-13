import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateLicenseUIComponent } from './validate-license-ui.component';

describe('ValidateLicenseUIComponent', () => {
  let component: ValidateLicenseUIComponent;
  let fixture: ComponentFixture<ValidateLicenseUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateLicenseUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateLicenseUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
