import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APrintHeaderComponent } from './aprint-header.component';

describe('APrintHeaderComponent', () => {
  let component: APrintHeaderComponent;
  let fixture: ComponentFixture<APrintHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ APrintHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(APrintHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
