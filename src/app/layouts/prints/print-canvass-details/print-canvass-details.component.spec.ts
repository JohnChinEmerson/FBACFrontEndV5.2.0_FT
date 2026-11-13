import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCanvassDetailsComponent } from './print-canvass-details.component';

describe('PrintCanvassDetailsComponent', () => {
  let component: PrintCanvassDetailsComponent;
  let fixture: ComponentFixture<PrintCanvassDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCanvassDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCanvassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
