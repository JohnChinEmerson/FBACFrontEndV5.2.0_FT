import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POHeaderUIComponent } from './poheader-ui.component';

describe('POHeaderUIComponent', () => {
  let component: POHeaderUIComponent;
  let fixture: ComponentFixture<POHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
