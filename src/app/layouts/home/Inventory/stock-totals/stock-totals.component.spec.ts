import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTotalsComponent } from './stock-totals.component';

describe('StockTotalsComponent', () => {
  let component: StockTotalsComponent;
  let fixture: ComponentFixture<StockTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
