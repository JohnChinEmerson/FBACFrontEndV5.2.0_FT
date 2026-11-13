import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuButtonsUIComponent } from './sub-menu-buttons-ui.component';

describe('SubMenuButtonsUIComponent', () => {
  let component: SubMenuButtonsUIComponent;
  let fixture: ComponentFixture<SubMenuButtonsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenuButtonsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuButtonsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
