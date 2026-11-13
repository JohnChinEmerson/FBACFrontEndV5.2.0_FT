import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierItemsComponent } from './print-supplier-items.component';

describe('PrintSupplierItemsComponent', () => {
  let component: PrintSupplierItemsComponent;
  let fixture: ComponentFixture<PrintSupplierItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
