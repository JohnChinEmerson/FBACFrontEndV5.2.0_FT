import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoidSalesReportComponent } from './print-void-sales-report.component';

describe('PrintVoidSalesReportComponent', () => {
  let component: PrintVoidSalesReportComponent;
  let fixture: ComponentFixture<PrintVoidSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVoidSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVoidSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
