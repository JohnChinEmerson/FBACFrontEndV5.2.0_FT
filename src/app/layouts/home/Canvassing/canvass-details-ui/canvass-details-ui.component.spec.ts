import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassDetailsUIComponent } from './canvass-details-ui.component';

describe('CanvassDetailsUIComponent', () => {
  let component: CanvassDetailsUIComponent;
  let fixture: ComponentFixture<CanvassDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
