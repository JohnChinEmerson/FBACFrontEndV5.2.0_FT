import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUpdateUIComponent } from './branch-update-ui.component';

describe('BranchUpdateUIComponent', () => {
  let component: BranchUpdateUIComponent;
  let fixture: ComponentFixture<BranchUpdateUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchUpdateUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUpdateUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
