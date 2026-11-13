import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSuppliersReportComponent } from './item-suppliers-report.component';

describe('ItemSuppliersReportComponent', () => {
  let component: ItemSuppliersReportComponent;
  let fixture: ComponentFixture<ItemSuppliersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSuppliersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSuppliersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
