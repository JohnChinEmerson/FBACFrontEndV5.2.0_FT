import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUnitsUIComponent } from './item-units-ui.component';

describe('ItemUnitsUIComponent', () => {
  let component: ItemUnitsUIComponent;
  let fixture: ComponentFixture<ItemUnitsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUnitsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUnitsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
