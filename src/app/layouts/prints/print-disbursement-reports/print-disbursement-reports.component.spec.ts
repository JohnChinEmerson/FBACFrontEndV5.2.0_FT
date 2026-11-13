import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisbursementReportsComponent } from './print-disbursement-reports.component';

describe('PrintDisbursementReportsComponent', () => {
  let component: PrintDisbursementReportsComponent;
  let fixture: ComponentFixture<PrintDisbursementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDisbursementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisbursementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
