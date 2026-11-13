import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherReportsUIComponent } from './voucher-reports-ui.component';

describe('VoucherReportsUIComponent', () => {
  let component: VoucherReportsUIComponent;
  let fixture: ComponentFixture<VoucherReportsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherReportsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherReportsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
