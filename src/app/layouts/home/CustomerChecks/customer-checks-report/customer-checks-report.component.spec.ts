import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChecksReportComponent } from './customer-checks-report.component';

describe('CustomerChecksReportComponent', () => {
  let component: CustomerChecksReportComponent;
  let fixture: ComponentFixture<CustomerChecksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerChecksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChecksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
