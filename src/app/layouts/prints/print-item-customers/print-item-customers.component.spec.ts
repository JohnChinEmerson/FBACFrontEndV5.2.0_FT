import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemCustomersComponent } from './print-item-customers.component';

describe('PrintItemCustomersComponent', () => {
  let component: PrintItemCustomersComponent;
  let fixture: ComponentFixture<PrintItemCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
