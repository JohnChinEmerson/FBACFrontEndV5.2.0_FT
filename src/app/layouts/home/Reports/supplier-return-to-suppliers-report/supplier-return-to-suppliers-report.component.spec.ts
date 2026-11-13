import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReturnToSuppliersReportComponent } from './supplier-return-to-suppliers-report.component';

describe('SupplierReturnToSuppliersReportComponent', () => {
  let component: SupplierReturnToSuppliersReportComponent;
  let fixture: ComponentFixture<SupplierReturnToSuppliersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierReturnToSuppliersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReturnToSuppliersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
