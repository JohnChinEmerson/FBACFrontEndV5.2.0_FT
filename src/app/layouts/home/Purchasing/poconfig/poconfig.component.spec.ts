import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POConfigComponent } from './poconfig.component';

describe('POConfigComponent', () => {
  let component: POConfigComponent;
  let fixture: ComponentFixture<POConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
