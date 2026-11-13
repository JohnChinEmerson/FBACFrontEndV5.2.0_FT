import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEvaluationUIComponent } from './support-evaluation-ui.component';

describe('SupportEvaluationUIComponent', () => {
  let component: SupportEvaluationUIComponent;
  let fixture: ComponentFixture<SupportEvaluationUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportEvaluationUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportEvaluationUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
