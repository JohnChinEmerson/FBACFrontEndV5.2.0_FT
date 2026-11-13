import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassForPOUIComponent } from './canvass-for-poui.component';

describe('CanvassForPOUIComponent', () => {
  let component: CanvassForPOUIComponent;
  let fixture: ComponentFixture<CanvassForPOUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassForPOUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassForPOUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
