import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRequestUIComponent } from './voucher-request-ui.component';

describe('VoucherRequestUIComponent', () => {
  let component: VoucherRequestUIComponent;
  let fixture: ComponentFixture<VoucherRequestUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherRequestUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRequestUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
