import { TestBed } from '@angular/core/testing';

import { DailyStockAdjustmentReportService } from './daily-stock-adjustment-report.service';

describe('DailyStockAdjustmentReportService', () => {
  let service: DailyStockAdjustmentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyStockAdjustmentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
