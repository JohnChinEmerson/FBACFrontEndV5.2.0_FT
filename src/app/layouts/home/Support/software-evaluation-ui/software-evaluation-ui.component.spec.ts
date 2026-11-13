import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareEvaluationUIComponent } from './software-evaluation-ui.component';

describe('SoftwareEvaluationUIComponent', () => {
  let component: SoftwareEvaluationUIComponent;
  let fixture: ComponentFixture<SoftwareEvaluationUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareEvaluationUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareEvaluationUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
