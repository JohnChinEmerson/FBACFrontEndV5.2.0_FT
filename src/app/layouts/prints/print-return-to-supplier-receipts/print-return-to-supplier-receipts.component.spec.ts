import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReturnToSupplierReceiptsComponent } from './print-return-to-supplier-receipts.component';

describe('PrintReturnToSupplierReceiptsComponent', () => {
  let component: PrintReturnToSupplierReceiptsComponent;
  let fixture: ComponentFixture<PrintReturnToSupplierReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReturnToSupplierReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReturnToSupplierReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
