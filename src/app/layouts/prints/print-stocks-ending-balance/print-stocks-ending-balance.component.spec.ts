import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStocksEndingBalanceComponent } from './print-stocks-ending-balance.component';

describe('PrintStocksEndingBalanceComponent', () => {
  let component: PrintStocksEndingBalanceComponent;
  let fixture: ComponentFixture<PrintStocksEndingBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStocksEndingBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStocksEndingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
