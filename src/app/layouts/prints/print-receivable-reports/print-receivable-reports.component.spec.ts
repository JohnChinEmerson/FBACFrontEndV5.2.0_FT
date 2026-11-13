import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivableReportsComponent } from './print-receivable-reports.component';

describe('PrintReceivableReportsComponent', () => {
  let component: PrintReceivableReportsComponent;
  let fixture: ComponentFixture<PrintReceivableReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivableReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
