import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentReportsComponent } from './stock-adjustment-reports.component';

describe('StockAdjustmentReportsComponent', () => {
  let component: StockAdjustmentReportsComponent;
  let fixture: ComponentFixture<StockAdjustmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
