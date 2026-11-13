import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBalanceSheetComponent } from './print-balance-sheet.component';

describe('PrintBalanceSheetComponent', () => {
  let component: PrintBalanceSheetComponent;
  let fixture: ComponentFixture<PrintBalanceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBalanceSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
