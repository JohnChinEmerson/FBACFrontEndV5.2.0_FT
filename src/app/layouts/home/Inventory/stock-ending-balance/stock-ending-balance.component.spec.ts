import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEndingBalanceComponent } from './stock-ending-balance.component';

describe('StockEndingBalanceComponent', () => {
  let component: StockEndingBalanceComponent;
  let fixture: ComponentFixture<StockEndingBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockEndingBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEndingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
