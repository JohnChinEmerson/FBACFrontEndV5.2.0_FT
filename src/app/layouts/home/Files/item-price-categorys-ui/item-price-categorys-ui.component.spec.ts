import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPriceCategorysUIComponent } from './item-price-categorys-ui.component';

describe('ItemPriceCategorysUIComponent', () => {
  let component: ItemPriceCategorysUIComponent;
  let fixture: ComponentFixture<ItemPriceCategorysUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPriceCategorysUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPriceCategorysUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
