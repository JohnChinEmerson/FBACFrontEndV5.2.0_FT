import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XZReadingsComponent } from './xzreadings.component';

describe('XZReadingsComponent', () => {
  let component: XZReadingsComponent;
  let fixture: ComponentFixture<XZReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XZReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XZReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
