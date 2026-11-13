import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POReportsComponent } from './poreports.component';

describe('POReportsComponent', () => {
  let component: POReportsComponent;
  let fixture: ComponentFixture<POReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
