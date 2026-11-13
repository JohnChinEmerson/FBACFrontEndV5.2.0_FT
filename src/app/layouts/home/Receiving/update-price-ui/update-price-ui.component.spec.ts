import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePriceUIComponent } from './update-price-ui.component';

describe('UpdatePriceUIComponent', () => {
  let component: UpdatePriceUIComponent;
  let fixture: ComponentFixture<UpdatePriceUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePriceUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePriceUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
