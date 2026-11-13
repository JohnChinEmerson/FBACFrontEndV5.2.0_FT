import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentHeaderUIComponent } from './stock-adjustment-header-ui.component';

describe('StockAdjustmentHeaderUIComponent', () => {
  let component: StockAdjustmentHeaderUIComponent;
  let fixture: ComponentFixture<StockAdjustmentHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
