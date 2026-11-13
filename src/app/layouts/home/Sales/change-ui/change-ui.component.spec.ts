import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUIComponent } from './change-ui.component';

describe('ChangeUIComponent', () => {
  let component: ChangeUIComponent;
  let fixture: ComponentFixture<ChangeUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
