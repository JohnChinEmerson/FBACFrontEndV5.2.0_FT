import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInventoryStocksComponent } from './print-inventory-stocks.component';

describe('PrintInventoryStocksComponent', () => {
  let component: PrintInventoryStocksComponent;
  let fixture: ComponentFixture<PrintInventoryStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInventoryStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInventoryStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
