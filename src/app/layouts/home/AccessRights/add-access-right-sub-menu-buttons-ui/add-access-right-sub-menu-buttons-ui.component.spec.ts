import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessRightSubMenuButtonsUIComponent } from './add-access-right-sub-menu-buttons-ui.component';

describe('AddAccessRightSubMenuButtonsUIComponent', () => {
  let component: AddAccessRightSubMenuButtonsUIComponent;
  let fixture: ComponentFixture<AddAccessRightSubMenuButtonsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccessRightSubMenuButtonsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccessRightSubMenuButtonsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
