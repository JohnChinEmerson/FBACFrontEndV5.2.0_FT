import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashTransfersComponent } from './print-cash-transfers.component';

describe('PrintCashTransfersComponent', () => {
  let component: PrintCashTransfersComponent;
  let fixture: ComponentFixture<PrintCashTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashTransfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
