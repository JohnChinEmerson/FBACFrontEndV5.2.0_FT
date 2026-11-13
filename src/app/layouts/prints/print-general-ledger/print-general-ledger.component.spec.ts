import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGeneralLedgerComponent } from './print-general-ledger.component';

describe('PrintGeneralLedgerComponent', () => {
  let component: PrintGeneralLedgerComponent;
  let fixture: ComponentFixture<PrintGeneralLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintGeneralLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintGeneralLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
