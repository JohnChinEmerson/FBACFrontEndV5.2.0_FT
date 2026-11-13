import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PODetailsUIComponent } from './podetails-ui.component';

describe('PODetailsUIComponent', () => {
  let component: PODetailsUIComponent;
  let fixture: ComponentFixture<PODetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PODetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PODetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
