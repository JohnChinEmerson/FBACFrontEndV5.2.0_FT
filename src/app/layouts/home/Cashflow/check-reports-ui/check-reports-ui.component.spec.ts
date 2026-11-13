import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckReportsUIComponent } from './check-reports-ui.component';

describe('CheckReportsUIComponent', () => {
  let component: CheckReportsUIComponent;
  let fixture: ComponentFixture<CheckReportsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckReportsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckReportsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
