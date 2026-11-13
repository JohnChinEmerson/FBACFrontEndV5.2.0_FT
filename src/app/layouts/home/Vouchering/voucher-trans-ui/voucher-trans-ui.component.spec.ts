import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTransUIComponent } from './voucher-trans-ui.component';

describe('VoucherTransUIComponent', () => {
  let component: VoucherTransUIComponent;
  let fixture: ComponentFixture<VoucherTransUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherTransUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTransUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
