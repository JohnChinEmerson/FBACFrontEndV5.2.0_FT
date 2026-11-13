import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLedgerUIComponent } from './stock-ledger-ui.component';

describe('StockLedgerUIComponent', () => {
  let component: StockLedgerUIComponent;
  let fixture: ComponentFixture<StockLedgerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockLedgerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockLedgerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
