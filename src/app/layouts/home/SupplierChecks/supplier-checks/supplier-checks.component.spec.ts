import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierChecksComponent } from './supplier-checks.component';

describe('SupplierChecksComponent', () => {
  let component: SupplierChecksComponent;
  let fixture: ComponentFixture<SupplierChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
