import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForReturnToSupplierUIComponent } from './load-items-for-return-to-supplier-ui.component';

describe('LoadItemsForReturnToSupplierUIComponent', () => {
  let component: LoadItemsForReturnToSupplierUIComponent;
  let fixture: ComponentFixture<LoadItemsForReturnToSupplierUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForReturnToSupplierUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForReturnToSupplierUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
