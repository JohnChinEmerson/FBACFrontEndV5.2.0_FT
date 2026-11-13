import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtToCashCoverageComponent } from './debt-to-cash-coverage.component';

describe('DebtToCashCoverageComponent', () => {
  let component: DebtToCashCoverageComponent;
  let fixture: ComponentFixture<DebtToCashCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtToCashCoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtToCashCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
