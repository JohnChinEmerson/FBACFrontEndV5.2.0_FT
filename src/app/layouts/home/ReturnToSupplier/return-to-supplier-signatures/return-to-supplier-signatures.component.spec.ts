import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierSignaturesComponent } from './return-to-supplier-signatures.component';

describe('ReturnToSupplierSignaturesComponent', () => {
  let component: ReturnToSupplierSignaturesComponent;
  let fixture: ComponentFixture<ReturnToSupplierSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
