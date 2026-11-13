import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsUIComponent } from './popups-ui.component';

describe('PopupsUIComponent', () => {
  let component: PopupsUIComponent;
  let fixture: ComponentFixture<PopupsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
