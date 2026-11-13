import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUsersUIComponent } from './branch-users-ui.component';

describe('BranchUsersUIComponent', () => {
  let component: BranchUsersUIComponent;
  let fixture: ComponentFixture<BranchUsersUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchUsersUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUsersUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
