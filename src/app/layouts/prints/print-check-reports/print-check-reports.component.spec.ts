import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCheckReportsComponent } from './print-check-reports.component';

describe('PrintCheckReportsComponent', () => {
  let component: PrintCheckReportsComponent;
  let fixture: ComponentFixture<PrintCheckReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCheckReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCheckReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
