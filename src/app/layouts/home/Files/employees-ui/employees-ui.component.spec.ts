import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesUIComponent } from './employees-ui.component';

describe('EmployeesUIComponent', () => {
  let component: EmployeesUIComponent;
  let fixture: ComponentFixture<EmployeesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
