import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PODetailUIComponent } from './podetail-ui.component';

describe('PODetailUIComponent', () => {
  let component: PODetailUIComponent;
  let fixture: ComponentFixture<PODetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PODetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PODetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
