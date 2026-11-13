import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassDetailUIComponent } from './canvass-detail-ui.component';

describe('CanvassDetailUIComponent', () => {
  let component: CanvassDetailUIComponent;
  let fixture: ComponentFixture<CanvassDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
