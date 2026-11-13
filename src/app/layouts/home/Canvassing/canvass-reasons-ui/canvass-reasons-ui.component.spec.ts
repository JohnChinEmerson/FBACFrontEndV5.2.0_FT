import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassReasonsUIComponent } from './canvass-reasons-ui.component';

describe('CanvassReasonsUIComponent', () => {
  let component: CanvassReasonsUIComponent;
  let fixture: ComponentFixture<CanvassReasonsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassReasonsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassReasonsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
