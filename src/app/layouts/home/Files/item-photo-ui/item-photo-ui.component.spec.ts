import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPhotoUIComponent } from './item-photo-ui.component';

describe('ItemPhotoUIComponent', () => {
  let component: ItemPhotoUIComponent;
  let fixture: ComponentFixture<ItemPhotoUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPhotoUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPhotoUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
