import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCostHistoryComponent } from './item-cost-history.component';

describe('ItemCostHistoryComponent', () => {
  let component: ItemCostHistoryComponent;
  let fixture: ComponentFixture<ItemCostHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCostHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
