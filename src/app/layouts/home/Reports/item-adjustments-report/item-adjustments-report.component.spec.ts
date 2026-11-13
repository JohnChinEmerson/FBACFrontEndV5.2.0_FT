import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAdjustmentsReportComponent } from './item-adjustments-report.component';

describe('ItemAdjustmentsReportComponent', () => {
  let component: ItemAdjustmentsReportComponent;
  let fixture: ComponentFixture<ItemAdjustmentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAdjustmentsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAdjustmentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
