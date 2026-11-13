import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransferJournalComponent } from './cash-transfer-journal.component';

describe('CashTransferJournalComponent', () => {
  let component: CashTransferJournalComponent;
  let fixture: ComponentFixture<CashTransferJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTransferJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashTransferJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
