import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPointsUIComponent } from './customer-points-ui.component';

describe('CustomerPointsUIComponent', () => {
  let component: CustomerPointsUIComponent;
  let fixture: ComponentFixture<CustomerPointsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPointsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPointsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
