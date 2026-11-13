import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingLedgerComponent } from './receiving-ledger.component';

describe('ReceivingLedgerComponent', () => {
  let component: ReceivingLedgerComponent;
  let fixture: ComponentFixture<ReceivingLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
