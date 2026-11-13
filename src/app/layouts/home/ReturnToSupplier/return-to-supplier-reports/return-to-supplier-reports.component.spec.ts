import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierReportsComponent } from './return-to-supplier-reports.component';

describe('ReturnToSupplierReportsComponent', () => {
  let component: ReturnToSupplierReportsComponent;
  let fixture: ComponentFixture<ReturnToSupplierReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
