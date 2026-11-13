import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundLogoUIComponent } from './background-logo-ui.component';

describe('BackgroundLogoUIComponent', () => {
  let component: BackgroundLogoUIComponent;
  let fixture: ComponentFixture<BackgroundLogoUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLogoUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLogoUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
