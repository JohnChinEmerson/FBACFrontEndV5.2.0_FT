import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSaleReturnsReportComponent } from './item-sale-returns-report.component';

describe('ItemSaleReturnsReportComponent', () => {
  let component: ItemSaleReturnsReportComponent;
  let fixture: ComponentFixture<ItemSaleReturnsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSaleReturnsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSaleReturnsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
