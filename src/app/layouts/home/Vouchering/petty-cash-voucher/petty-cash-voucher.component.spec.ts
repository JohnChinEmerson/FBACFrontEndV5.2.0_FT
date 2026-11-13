import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashVoucherComponent } from './petty-cash-voucher.component';

describe('PettyCashVoucherComponent', () => {
  let component: PettyCashVoucherComponent;
  let fixture: ComponentFixture<PettyCashVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PettyCashVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PettyCashVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
