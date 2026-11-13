import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExpiryDateUIComponent } from './item-expiry-date-ui.component';

describe('ItemExpiryDateUIComponent', () => {
  let component: ItemExpiryDateUIComponent;
  let fixture: ComponentFixture<ItemExpiryDateUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemExpiryDateUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExpiryDateUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
