import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForOrderUIComponent } from './load-items-for-order-ui.component';

describe('LoadItemsForOrderUIComponent', () => {
  let component: LoadItemsForOrderUIComponent;
  let fixture: ComponentFixture<LoadItemsForOrderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForOrderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForOrderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
