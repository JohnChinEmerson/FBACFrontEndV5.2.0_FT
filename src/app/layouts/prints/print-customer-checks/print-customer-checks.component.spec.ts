import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerChecksComponent } from './print-customer-checks.component';

describe('PrintCustomerChecksComponent', () => {
  let component: PrintCustomerChecksComponent;
  let fixture: ComponentFixture<PrintCustomerChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
