import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierReturnToSuppliersComponent } from './print-supplier-return-to-suppliers.component';

describe('PrintSupplierReturnToSuppliersComponent', () => {
  let component: PrintSupplierReturnToSuppliersComponent;
  let fixture: ComponentFixture<PrintSupplierReturnToSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierReturnToSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierReturnToSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
