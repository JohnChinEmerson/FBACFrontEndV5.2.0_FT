import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementTransactionUIComponent } from './disbursement-transaction-ui.component';

describe('DisbursementTransactionUIComponent', () => {
  let component: DisbursementTransactionUIComponent;
  let fixture: ComponentFixture<DisbursementTransactionUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementTransactionUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementTransactionUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
