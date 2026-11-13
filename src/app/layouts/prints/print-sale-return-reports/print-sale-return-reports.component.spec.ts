import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReturnReportsComponent } from './print-sale-return-reports.component';

describe('PrintSaleReturnReportsComponent', () => {
  let component: PrintSaleReturnReportsComponent;
  let fixture: ComponentFixture<PrintSaleReturnReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReturnReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReturnReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
