import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentReceiptsComponent } from './stock-adjustment-receipts.component';

describe('StockAdjustmentReceiptsComponent', () => {
  let component: StockAdjustmentReceiptsComponent;
  let fixture: ComponentFixture<StockAdjustmentReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
