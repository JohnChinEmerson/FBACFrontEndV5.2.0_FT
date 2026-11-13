import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisbursementReceiptsComponent } from './print-disbursement-receipts.component';

describe('PrintDisbursementReceiptsComponent', () => {
  let component: PrintDisbursementReceiptsComponent;
  let fixture: ComponentFixture<PrintDisbursementReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDisbursementReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisbursementReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
