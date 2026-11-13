import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupConfigUIComponent } from './popup-config-ui.component';

describe('PopupConfigUIComponent', () => {
  let component: PopupConfigUIComponent;
  let fixture: ComponentFixture<PopupConfigUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupConfigUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConfigUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
