import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAccessRightsUIComponent } from './popup-access-rights-ui.component';

describe('PopupAccessRightsUIComponent', () => {
  let component: PopupAccessRightsUIComponent;
  let fixture: ComponentFixture<PopupAccessRightsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupAccessRightsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAccessRightsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
