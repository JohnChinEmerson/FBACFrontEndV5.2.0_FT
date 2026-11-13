import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReadingRecordsUIComponent } from './cash-reading-records-ui.component';

describe('CashReadingRecordsUIComponent', () => {
  let component: CashReadingRecordsUIComponent;
  let fixture: ComponentFixture<CashReadingRecordsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReadingRecordsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReadingRecordsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
