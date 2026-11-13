import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleUMsComponent } from './multiple-ums.component';

describe('MultipleUMsComponent', () => {
  let component: MultipleUMsComponent;
  let fixture: ComponentFixture<MultipleUMsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleUMsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleUMsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
