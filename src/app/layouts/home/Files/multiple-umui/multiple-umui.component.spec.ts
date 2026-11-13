import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleUMUIComponent } from './multiple-umui.component';

describe('MultipleUMUIComponent', () => {
  let component: MultipleUMUIComponent;
  let fixture: ComponentFixture<MultipleUMUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleUMUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleUMUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
