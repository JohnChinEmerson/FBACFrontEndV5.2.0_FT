import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentConfigComponent } from './stock-adjustment-config.component';

describe('StockAdjustmentConfigComponent', () => {
  let component: StockAdjustmentConfigComponent;
  let fixture: ComponentFixture<StockAdjustmentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
