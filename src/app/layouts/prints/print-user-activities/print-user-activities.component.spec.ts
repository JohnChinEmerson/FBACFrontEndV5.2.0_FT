import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUserActivitiesComponent } from './print-user-activities.component';

describe('PrintUserActivitiesComponent', () => {
  let component: PrintUserActivitiesComponent;
  let fixture: ComponentFixture<PrintUserActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintUserActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintUserActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
