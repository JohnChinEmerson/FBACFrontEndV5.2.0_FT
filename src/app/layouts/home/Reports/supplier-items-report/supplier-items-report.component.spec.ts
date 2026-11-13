import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierItemsReportComponent } from './supplier-items-report.component';

describe('SupplierItemsReportComponent', () => {
  let component: SupplierItemsReportComponent;
  let fixture: ComponentFixture<SupplierItemsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierItemsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierItemsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
