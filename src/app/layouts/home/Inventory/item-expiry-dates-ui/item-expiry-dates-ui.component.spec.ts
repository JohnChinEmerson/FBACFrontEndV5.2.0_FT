import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExpiryDatesUIComponent } from './item-expiry-dates-ui.component';

describe('ItemExpiryDatesUIComponent', () => {
  let component: ItemExpiryDatesUIComponent;
  let fixture: ComponentFixture<ItemExpiryDatesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemExpiryDatesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExpiryDatesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
