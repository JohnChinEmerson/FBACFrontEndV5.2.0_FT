import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSupplierChecksComponent } from './print-supplier-checks.component';

describe('PrintSupplierChecksComponent', () => {
  let component: PrintSupplierChecksComponent;
  let fixture: ComponentFixture<PrintSupplierChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSupplierChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSupplierChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
