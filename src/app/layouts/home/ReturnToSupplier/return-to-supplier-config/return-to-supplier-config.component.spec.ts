import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierConfigComponent } from './return-to-supplier-config.component';

describe('ReturnToSupplierConfigComponent', () => {
  let component: ReturnToSupplierConfigComponent;
  let fixture: ComponentFixture<ReturnToSupplierConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
