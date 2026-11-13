import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCanvassReportsComponent } from './print-canvass-reports.component';

describe('PrintCanvassReportsComponent', () => {
  let component: PrintCanvassReportsComponent;
  let fixture: ComponentFixture<PrintCanvassReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCanvassReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCanvassReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
