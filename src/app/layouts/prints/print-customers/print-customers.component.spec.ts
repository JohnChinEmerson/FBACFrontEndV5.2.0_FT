import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomersComponent } from './print-customers.component';

describe('PrintCustomersComponent', () => {
  let component: PrintCustomersComponent;
  let fixture: ComponentFixture<PrintCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
