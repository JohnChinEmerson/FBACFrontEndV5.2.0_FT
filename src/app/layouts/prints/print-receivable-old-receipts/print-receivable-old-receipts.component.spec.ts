import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivableOldReceiptsComponent } from './print-receivable-old-receipts.component';

describe('PrintReceivableOldReceiptsComponent', () => {
  let component: PrintReceivableOldReceiptsComponent;
  let fixture: ComponentFixture<PrintReceivableOldReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivableOldReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivableOldReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
