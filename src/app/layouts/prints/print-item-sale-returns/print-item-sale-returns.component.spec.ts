import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemSaleReturnsComponent } from './print-item-sale-returns.component';

describe('PrintItemSaleReturnsComponent', () => {
  let component: PrintItemSaleReturnsComponent;
  let fixture: ComponentFixture<PrintItemSaleReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemSaleReturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemSaleReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
