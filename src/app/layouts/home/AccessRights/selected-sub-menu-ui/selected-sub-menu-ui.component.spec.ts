import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSubMenuUIComponent } from './selected-sub-menu-ui.component';

describe('SelectedSubMenuUIComponent', () => {
  let component: SelectedSubMenuUIComponent;
  let fixture: ComponentFixture<SelectedSubMenuUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSubMenuUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSubMenuUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
