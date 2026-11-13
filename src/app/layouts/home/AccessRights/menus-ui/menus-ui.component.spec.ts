import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusUIComponent } from './menus-ui.component';

describe('MenusUIComponent', () => {
  let component: MenusUIComponent;
  let fixture: ComponentFixture<MenusUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
