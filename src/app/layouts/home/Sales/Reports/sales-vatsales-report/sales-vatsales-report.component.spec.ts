import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVATSalesReportComponent } from './sales-vatsales-report.component';

describe('SalesVATSalesReportComponent', () => {
  let component: SalesVATSalesReportComponent;
  let fixture: ComponentFixture<SalesVATSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesVATSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVATSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
