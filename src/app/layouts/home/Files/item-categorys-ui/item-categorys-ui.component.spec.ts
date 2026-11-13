import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategorysUIComponent } from './item-categorys-ui.component';

describe('ItemCategorysUIComponent', () => {
  let component: ItemCategorysUIComponent;
  let fixture: ComponentFixture<ItemCategorysUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCategorysUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCategorysUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
