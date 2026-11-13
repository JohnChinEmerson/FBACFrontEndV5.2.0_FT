import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturesUIComponent } from './signatures-ui.component';

describe('SignaturesUIComponent', () => {
  let component: SignaturesUIComponent;
  let fixture: ComponentFixture<SignaturesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
