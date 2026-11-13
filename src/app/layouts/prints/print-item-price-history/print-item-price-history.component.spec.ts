import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemPriceHistoryComponent } from './print-item-price-history.component';

describe('PrintItemPriceHistoryComponent', () => {
  let component: PrintItemPriceHistoryComponent;
  let fixture: ComponentFixture<PrintItemPriceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemPriceHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemPriceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
