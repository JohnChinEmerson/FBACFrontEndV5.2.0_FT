import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XReadingsComponent } from './xreadings.component';

describe('XReadingsComponent', () => {
  let component: XReadingsComponent;
  let fixture: ComponentFixture<XReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
