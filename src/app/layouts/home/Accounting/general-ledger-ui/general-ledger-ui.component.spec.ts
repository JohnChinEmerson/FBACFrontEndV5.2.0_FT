import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerUIComponent } from './general-ledger-ui.component';

describe('GeneralLedgerUIComponent', () => {
  let component: GeneralLedgerUIComponent;
  let fixture: ComponentFixture<GeneralLedgerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralLedgerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
