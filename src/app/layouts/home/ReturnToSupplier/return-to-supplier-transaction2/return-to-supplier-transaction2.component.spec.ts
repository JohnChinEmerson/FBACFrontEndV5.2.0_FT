import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierTransaction2Component } from './return-to-supplier-transaction2.component';

describe('ReturnToSupplierTransaction2Component', () => {
  let component: ReturnToSupplierTransaction2Component;
  let fixture: ComponentFixture<ReturnToSupplierTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
