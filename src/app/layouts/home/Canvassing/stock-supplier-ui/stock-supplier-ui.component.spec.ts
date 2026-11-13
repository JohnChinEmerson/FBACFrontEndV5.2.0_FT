import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSupplierUIComponent } from './stock-supplier-ui.component';

describe('StockSupplierUIComponent', () => {
  let component: StockSupplierUIComponent;
  let fixture: ComponentFixture<StockSupplierUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSupplierUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSupplierUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
