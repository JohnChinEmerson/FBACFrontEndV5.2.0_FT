import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPayableOldReceiptsComponent } from './print-payable-old-receipts.component';

describe('PrintPayableOldReceiptsComponent', () => {
  let component: PrintPayableOldReceiptsComponent;
  let fixture: ComponentFixture<PrintPayableOldReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPayableOldReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPayableOldReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
