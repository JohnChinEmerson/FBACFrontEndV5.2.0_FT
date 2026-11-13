import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassTransaction2Component } from './canvass-transaction2.component';

describe('CanvassTransaction2Component', () => {
  let component: CanvassTransaction2Component;
  let fixture: ComponentFixture<CanvassTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
