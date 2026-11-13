import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDebtToCashCoverageComponent } from './print-debt-to-cash-coverage.component';

describe('PrintDebtToCashCoverageComponent', () => {
  let component: PrintDebtToCashCoverageComponent;
  let fixture: ComponentFixture<PrintDebtToCashCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDebtToCashCoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDebtToCashCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
