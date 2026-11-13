import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POTransaction2Component } from './potransaction2.component';

describe('POTransaction2Component', () => {
  let component: POTransaction2Component;
  let fixture: ComponentFixture<POTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
