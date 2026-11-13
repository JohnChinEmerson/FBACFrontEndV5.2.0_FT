import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassSuppliersUIComponent } from './canvass-suppliers-ui.component';

describe('CanvassSuppliersUIComponent', () => {
  let component: CanvassSuppliersUIComponent;
  let fixture: ComponentFixture<CanvassSuppliersUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassSuppliersUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassSuppliersUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
