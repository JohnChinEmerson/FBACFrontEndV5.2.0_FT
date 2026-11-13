import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReturnToSupplierDetailsComponent } from './print-return-to-supplier-details.component';

describe('PrintReturnToSupplierDetailsComponent', () => {
  let component: PrintReturnToSupplierDetailsComponent;
  let fixture: ComponentFixture<PrintReturnToSupplierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReturnToSupplierDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReturnToSupplierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
