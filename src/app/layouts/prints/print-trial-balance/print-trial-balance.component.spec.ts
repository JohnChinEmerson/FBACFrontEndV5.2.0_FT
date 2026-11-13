import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTrialBalanceComponent } from './print-trial-balance.component';

describe('PrintTrialBalanceComponent', () => {
  let component: PrintTrialBalanceComponent;
  let fixture: ComponentFixture<PrintTrialBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintTrialBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTrialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
