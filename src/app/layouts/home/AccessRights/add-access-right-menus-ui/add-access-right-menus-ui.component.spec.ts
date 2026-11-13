import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessRightMenusUIComponent } from './add-access-right-menus-ui.component';

describe('AddAccessRightMenusUIComponent', () => {
  let component: AddAccessRightMenusUIComponent;
  let fixture: ComponentFixture<AddAccessRightMenusUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccessRightMenusUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccessRightMenusUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
