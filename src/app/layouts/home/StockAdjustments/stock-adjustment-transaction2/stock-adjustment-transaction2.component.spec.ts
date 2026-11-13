import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentTransaction2Component } from './stock-adjustment-transaction2.component';

describe('StockAdjustmentTransaction2Component', () => {
  let component: StockAdjustmentTransaction2Component;
  let fixture: ComponentFixture<StockAdjustmentTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
