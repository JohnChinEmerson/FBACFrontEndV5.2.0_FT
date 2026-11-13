import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessRightSubMenusUIComponent } from './add-access-right-sub-menus-ui.component';

describe('AddAccessRightSubMenusUIComponent', () => {
  let component: AddAccessRightSubMenusUIComponent;
  let fixture: ComponentFixture<AddAccessRightSubMenusUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccessRightSubMenusUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccessRightSubMenusUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
