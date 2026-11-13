import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCheckUIComponent } from './customer-check-ui.component';

describe('CustomerCheckUIComponent', () => {
  let component: CustomerCheckUIComponent;
  let fixture: ComponentFixture<CustomerCheckUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCheckUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCheckUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
