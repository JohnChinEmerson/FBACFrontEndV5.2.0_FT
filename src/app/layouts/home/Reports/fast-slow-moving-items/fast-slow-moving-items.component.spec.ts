import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastSlowMovingItemsComponent } from './fast-slow-moving-items.component';

describe('FastSlowMovingItemsComponent', () => {
  let component: FastSlowMovingItemsComponent;
  let fixture: ComponentFixture<FastSlowMovingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastSlowMovingItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastSlowMovingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
