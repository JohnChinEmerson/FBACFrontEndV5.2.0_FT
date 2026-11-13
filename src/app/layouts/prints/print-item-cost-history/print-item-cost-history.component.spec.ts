import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemCostHistoryComponent } from './print-item-cost-history.component';

describe('PrintItemCostHistoryComponent', () => {
  let component: PrintItemCostHistoryComponent;
  let fixture: ComponentFixture<PrintItemCostHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemCostHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemCostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
