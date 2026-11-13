import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessStylesUIComponent } from './business-styles-ui.component';

describe('BusinessStylesUIComponent', () => {
  let component: BusinessStylesUIComponent;
  let fixture: ComponentFixture<BusinessStylesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessStylesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessStylesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
