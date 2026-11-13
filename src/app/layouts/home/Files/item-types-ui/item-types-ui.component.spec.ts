import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypesUIComponent } from './item-types-ui.component';

describe('ItemTypesUIComponent', () => {
  let component: ItemTypesUIComponent;
  let fixture: ComponentFixture<ItemTypesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTypesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
