import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSupplierHeaderUIComponent } from './return-to-supplier-header-ui.component';

describe('ReturnToSupplierHeaderUIComponent', () => {
  let component: ReturnToSupplierHeaderUIComponent;
  let fixture: ComponentFixture<ReturnToSupplierHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToSupplierHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToSupplierHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
