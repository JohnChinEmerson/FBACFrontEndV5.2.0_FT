import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentDetailsUIComponent } from './stock-adjustment-details-ui.component';

describe('StockAdjustmentDetailsUIComponent', () => {
  let component: StockAdjustmentDetailsUIComponent;
  let fixture: ComponentFixture<StockAdjustmentDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
