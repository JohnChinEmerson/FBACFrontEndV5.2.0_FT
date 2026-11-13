import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPayableReportsComponent } from './print-payable-reports.component';

describe('PrintPayableReportsComponent', () => {
  let component: PrintPayableReportsComponent;
  let fixture: ComponentFixture<PrintPayableReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPayableReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPayableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
