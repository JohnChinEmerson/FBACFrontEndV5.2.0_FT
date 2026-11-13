import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSignaturesComponent } from './voucher-signatures.component';

describe('VoucherSignaturesComponent', () => {
  let component: VoucherSignaturesComponent;
  let fixture: ComponentFixture<VoucherSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
