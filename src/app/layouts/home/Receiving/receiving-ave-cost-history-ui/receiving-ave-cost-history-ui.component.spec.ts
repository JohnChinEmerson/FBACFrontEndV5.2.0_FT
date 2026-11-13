import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingAveCostHistoryUIComponent } from './receiving-ave-cost-history-ui.component';

describe('ReceivingAveCostHistoryUIComponent', () => {
  let component: ReceivingAveCostHistoryUIComponent;
  let fixture: ComponentFixture<ReceivingAveCostHistoryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingAveCostHistoryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingAveCostHistoryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
