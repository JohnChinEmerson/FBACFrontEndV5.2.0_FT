import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnReportsComponent } from './sale-return-reports.component';

describe('SaleReturnReportsComponent', () => {
  let component: SaleReturnReportsComponent;
  let fixture: ComponentFixture<SaleReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
