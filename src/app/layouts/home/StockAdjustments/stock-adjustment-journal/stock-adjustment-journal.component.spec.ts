import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentJournalComponent } from './stock-adjustment-journal.component';

describe('StockAdjustmentJournalComponent', () => {
  let component: StockAdjustmentJournalComponent;
  let fixture: ComponentFixture<StockAdjustmentJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
