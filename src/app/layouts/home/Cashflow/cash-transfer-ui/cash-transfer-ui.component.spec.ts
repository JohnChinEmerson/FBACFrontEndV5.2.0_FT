import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransferUIComponent } from './cash-transfer-ui.component';

describe('CashTransferUIComponent', () => {
  let component: CashTransferUIComponent;
  let fixture: ComponentFixture<CashTransferUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashTransferUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashTransferUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
