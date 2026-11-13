import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidReasonUIComponent } from './void-reason-ui.component';

describe('VoidReasonUIComponent', () => {
  let component: VoidReasonUIComponent;
  let fixture: ComponentFixture<VoidReasonUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidReasonUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidReasonUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
