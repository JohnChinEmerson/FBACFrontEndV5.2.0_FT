import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassForApprovalComponent } from './canvass-for-approval.component';

describe('CanvassForApprovalComponent', () => {
  let component: CanvassForApprovalComponent;
  let fixture: ComponentFixture<CanvassForApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassForApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
