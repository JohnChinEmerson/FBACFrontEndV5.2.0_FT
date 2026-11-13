import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWHTaxSalesReportComponent } from './sales-whtax-sales-report.component';

describe('SalesWHTaxSalesReportComponent', () => {
  let component: SalesWHTaxSalesReportComponent;
  let fixture: ComponentFixture<SalesWHTaxSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWHTaxSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesWHTaxSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
