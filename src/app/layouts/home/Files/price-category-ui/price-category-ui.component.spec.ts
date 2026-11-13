import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCategoryUIComponent } from './price-category-ui.component';

describe('PriceCategoryUIComponent', () => {
  let component: PriceCategoryUIComponent;
  let fixture: ComponentFixture<PriceCategoryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceCategoryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCategoryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
