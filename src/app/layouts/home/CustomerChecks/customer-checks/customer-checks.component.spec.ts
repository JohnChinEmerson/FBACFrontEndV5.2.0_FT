import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChecksComponent } from './customer-checks.component';

describe('CustomerChecksComponent', () => {
  let component: CustomerChecksComponent;
  let fixture: ComponentFixture<CustomerChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
