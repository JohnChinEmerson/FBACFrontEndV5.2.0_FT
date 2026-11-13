import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedUserAccountUIComponent } from './selected-user-account-ui.component';

describe('SelectedUserAccountUIComponent', () => {
  let component: SelectedUserAccountUIComponent;
  let fixture: ComponentFixture<SelectedUserAccountUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedUserAccountUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedUserAccountUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
