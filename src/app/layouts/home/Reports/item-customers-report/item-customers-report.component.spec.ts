import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCustomersReportComponent } from './item-customers-report.component';

describe('ItemCustomersReportComponent', () => {
  let component: ItemCustomersReportComponent;
  let fixture: ComponentFixture<ItemCustomersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCustomersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
