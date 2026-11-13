import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessBackgroundLogoUIComponent } from './business-background-logo-ui.component';

describe('BusinessBackgroundLogoUIComponent', () => {
  let component: BusinessBackgroundLogoUIComponent;
  let fixture: ComponentFixture<BusinessBackgroundLogoUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessBackgroundLogoUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBackgroundLogoUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
