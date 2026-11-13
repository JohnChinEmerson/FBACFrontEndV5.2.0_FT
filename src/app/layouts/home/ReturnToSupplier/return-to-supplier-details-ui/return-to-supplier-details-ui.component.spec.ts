import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierDetailsUIComponent } from './return-to-supplier-details-ui.component';

describe('ReturnToSupplierDetailsUIComponent', () => {
  let component: ReturnToSupplierDetailsUIComponent;
  let fixture: ComponentFixture<ReturnToSupplierDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
