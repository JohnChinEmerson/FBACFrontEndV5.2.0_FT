import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemAdjustmentsComponent } from './print-item-adjustments.component';

describe('PrintItemAdjustmentsComponent', () => {
  let component: PrintItemAdjustmentsComponent;
  let fixture: ComponentFixture<PrintItemAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemAdjustmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
