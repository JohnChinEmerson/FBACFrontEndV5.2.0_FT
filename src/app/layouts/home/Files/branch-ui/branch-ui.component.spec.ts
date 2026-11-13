import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUIComponent } from './branch-ui.component';

describe('BranchUIComponent', () => {
  let component: BranchUIComponent;
  let fixture: ComponentFixture<BranchUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
