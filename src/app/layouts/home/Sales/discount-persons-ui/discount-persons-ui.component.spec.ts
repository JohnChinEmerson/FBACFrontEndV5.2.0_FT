import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountPersonsUIComponent } from './discount-persons-ui.component';

describe('DiscountPersonsUIComponent', () => {
  let component: DiscountPersonsUIComponent;
  let fixture: ComponentFixture<DiscountPersonsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountPersonsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountPersonsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
