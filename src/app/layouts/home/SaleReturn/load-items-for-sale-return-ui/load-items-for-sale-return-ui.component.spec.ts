import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForSaleReturnUIComponent } from './load-items-for-sale-return-ui.component';

describe('LoadItemsForSaleReturnUIComponent', () => {
  let component: LoadItemsForSaleReturnUIComponent;
  let fixture: ComponentFixture<LoadItemsForSaleReturnUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForSaleReturnUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForSaleReturnUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
