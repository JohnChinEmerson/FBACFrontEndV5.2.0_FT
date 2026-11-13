import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoidSalesReportComponent } from './sales-void-sales-report.component';

describe('SalesVoidSalesReportComponent', () => {
  let component: SalesVoidSalesReportComponent;
  let fixture: ComponentFixture<SalesVoidSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesVoidSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoidSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
