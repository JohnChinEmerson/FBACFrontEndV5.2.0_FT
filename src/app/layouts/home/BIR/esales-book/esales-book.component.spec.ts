import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESalesBookComponent } from './esales-book.component';

describe('ESalesBookComponent', () => {
  let component: ESalesBookComponent;
  let fixture: ComponentFixture<ESalesBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESalesBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ESalesBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
