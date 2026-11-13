import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerItemsReportComponent } from './customer-items-report.component';

describe('CustomerItemsReportComponent', () => {
  let component: CustomerItemsReportComponent;
  let fixture: ComponentFixture<CustomerItemsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerItemsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerItemsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
