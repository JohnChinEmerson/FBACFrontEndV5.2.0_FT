import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivingAveCostHistoryComponent } from './print-receiving-ave-cost-history.component';

describe('PrintReceivingAveCostHistoryComponent', () => {
  let component: PrintReceivingAveCostHistoryComponent;
  let fixture: ComponentFixture<PrintReceivingAveCostHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivingAveCostHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivingAveCostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
