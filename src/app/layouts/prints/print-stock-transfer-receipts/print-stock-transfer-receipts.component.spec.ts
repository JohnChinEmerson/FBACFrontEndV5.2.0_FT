import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockTransferReceiptsComponent } from './print-stock-transfer-receipts.component';

describe('PrintStockTransferReceiptsComponent', () => {
  let component: PrintStockTransferReceiptsComponent;
  let fixture: ComponentFixture<PrintStockTransferReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockTransferReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockTransferReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
