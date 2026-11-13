import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRecordsUIComponent } from './voucher-records-ui.component';

describe('VoucherRecordsUIComponent', () => {
  let component: VoucherRecordsUIComponent;
  let fixture: ComponentFixture<VoucherRecordsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherRecordsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRecordsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
