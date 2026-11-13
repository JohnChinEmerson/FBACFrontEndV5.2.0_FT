import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustPriceUIComponent } from './adjust-price-ui.component';

describe('AdjustPriceUIComponent', () => {
  let component: AdjustPriceUIComponent;
  let fixture: ComponentFixture<AdjustPriceUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustPriceUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustPriceUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
