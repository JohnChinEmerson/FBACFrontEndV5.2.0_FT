import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassReportsComponent } from './canvass-reports.component';

describe('CanvassReportsComponent', () => {
  let component: CanvassReportsComponent;
  let fixture: ComponentFixture<CanvassReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
