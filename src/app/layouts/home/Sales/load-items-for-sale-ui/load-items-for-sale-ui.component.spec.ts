import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForSaleUIComponent } from './load-items-for-sale-ui.component';

describe('LoadItemsForSaleUIComponent', () => {
  let component: LoadItemsForSaleUIComponent;
  let fixture: ComponentFixture<LoadItemsForSaleUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForSaleUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForSaleUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
