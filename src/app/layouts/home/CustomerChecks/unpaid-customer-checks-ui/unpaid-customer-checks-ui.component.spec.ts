import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidCustomerChecksUIComponent } from './unpaid-customer-checks-ui.component';

describe('UnpaidCustomerChecksUIComponent', () => {
  let component: UnpaidCustomerChecksUIComponent;
  let fixture: ComponentFixture<UnpaidCustomerChecksUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidCustomerChecksUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpaidCustomerChecksUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
