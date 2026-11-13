import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierDetailUIComponent } from './return-to-supplier-detail-ui.component';

describe('ReturnToSupplierDetailUIComponent', () => {
  let component: ReturnToSupplierDetailUIComponent;
  let fixture: ComponentFixture<ReturnToSupplierDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
