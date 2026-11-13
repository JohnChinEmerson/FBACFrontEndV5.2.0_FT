import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStocksComponent } from './inventory-stocks.component';

describe('InventoryStocksComponent', () => {
  let component: InventoryStocksComponent;
  let fixture: ComponentFixture<InventoryStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
