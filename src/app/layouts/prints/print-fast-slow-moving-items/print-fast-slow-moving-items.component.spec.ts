import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFastSlowMovingItemsComponent } from './print-fast-slow-moving-items.component';

describe('PrintFastSlowMovingItemsComponent', () => {
  let component: PrintFastSlowMovingItemsComponent;
  let fixture: ComponentFixture<PrintFastSlowMovingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintFastSlowMovingItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFastSlowMovingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
