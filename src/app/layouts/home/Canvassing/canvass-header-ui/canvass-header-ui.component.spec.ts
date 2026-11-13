import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassHeaderUIComponent } from './canvass-header-ui.component';

describe('CanvassHeaderUIComponent', () => {
  let component: CanvassHeaderUIComponent;
  let fixture: ComponentFixture<CanvassHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
