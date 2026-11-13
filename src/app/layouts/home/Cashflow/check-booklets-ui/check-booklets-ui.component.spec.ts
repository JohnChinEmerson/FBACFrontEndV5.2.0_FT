import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBookletsUIComponent } from './check-booklets-ui.component';

describe('CheckBookletsUIComponent', () => {
  let component: CheckBookletsUIComponent;
  let fixture: ComponentFixture<CheckBookletsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBookletsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBookletsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
