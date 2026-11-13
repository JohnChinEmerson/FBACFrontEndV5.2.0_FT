import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForStockAdjustmentUIComponent } from './load-items-for-stock-adjustment-ui.component';

describe('LoadItemsForStockAdjustmentUIComponent', () => {
  let component: LoadItemsForStockAdjustmentUIComponent;
  let fixture: ComponentFixture<LoadItemsForStockAdjustmentUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForStockAdjustmentUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForStockAdjustmentUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
