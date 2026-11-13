import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReturnReceiptsComponent } from './print-sale-return-receipts.component';

describe('PrintSaleReturnReceiptsComponent', () => {
  let component: PrintSaleReturnReceiptsComponent;
  let fixture: ComponentFixture<PrintSaleReturnReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReturnReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReturnReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
