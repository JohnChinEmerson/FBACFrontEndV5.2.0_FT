import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStockTransferDetailsComponent } from './print-stock-transfer-details.component';

describe('PrintStockTransferDetailsComponent', () => {
  let component: PrintStockTransferDetailsComponent;
  let fixture: ComponentFixture<PrintStockTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStockTransferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStockTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
