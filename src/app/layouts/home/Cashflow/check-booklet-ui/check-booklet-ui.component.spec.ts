import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBookletUIComponent } from './check-booklet-ui.component';

describe('CheckBookletUIComponent', () => {
  let component: CheckBookletUIComponent;
  let fixture: ComponentFixture<CheckBookletUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBookletUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBookletUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
