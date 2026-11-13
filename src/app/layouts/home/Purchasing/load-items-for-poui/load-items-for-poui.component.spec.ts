import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForPOUIComponent } from './load-items-for-poui.component';

describe('LoadItemsForPOUIComponent', () => {
  let component: LoadItemsForPOUIComponent;
  let fixture: ComponentFixture<LoadItemsForPOUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForPOUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForPOUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
