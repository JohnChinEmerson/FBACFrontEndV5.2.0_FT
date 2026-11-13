import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerItemsComponent } from './print-customer-items.component';

describe('PrintCustomerItemsComponent', () => {
  let component: PrintCustomerItemsComponent;
  let fixture: ComponentFixture<PrintCustomerItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
