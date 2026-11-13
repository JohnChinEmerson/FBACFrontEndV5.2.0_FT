import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierReceiptsComponent } from './return-to-supplier-receipts.component';

describe('ReturnToSupplierReceiptsComponent', () => {
  let component: ReturnToSupplierReceiptsComponent;
  let fixture: ComponentFixture<ReturnToSupplierReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
