import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadReceiptsForPaymentUIComponent } from './load-receipts-for-payment-ui.component';

describe('LoadReceiptsForPaymentUIComponent', () => {
  let component: LoadReceiptsForPaymentUIComponent;
  let fixture: ComponentFixture<LoadReceiptsForPaymentUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadReceiptsForPaymentUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadReceiptsForPaymentUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
