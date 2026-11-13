import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMenuUIComponent } from './selected-menu-ui.component';

describe('SelectedMenuUIComponent', () => {
  let component: SelectedMenuUIComponent;
  let fixture: ComponentFixture<SelectedMenuUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedMenuUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedMenuUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
