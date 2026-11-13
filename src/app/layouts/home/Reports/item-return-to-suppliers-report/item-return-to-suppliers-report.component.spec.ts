import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReturnToSuppliersReportComponent } from './item-return-to-suppliers-report.component';

describe('ItemReturnToSuppliersReportComponent', () => {
  let component: ItemReturnToSuppliersReportComponent;
  let fixture: ComponentFixture<ItemReturnToSuppliersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemReturnToSuppliersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReturnToSuppliersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
