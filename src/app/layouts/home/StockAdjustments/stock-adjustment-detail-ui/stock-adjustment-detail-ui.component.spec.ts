import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentDetailUIComponent } from './stock-adjustment-detail-ui.component';

describe('StockAdjustmentDetailUIComponent', () => {
  let component: StockAdjustmentDetailUIComponent;
  let fixture: ComponentFixture<StockAdjustmentDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
