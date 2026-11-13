import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashieringRecordDetailsComponent } from './print-cashiering-record-details.component';

describe('PrintCashieringRecordDetailsComponent', () => {
  let component: PrintCashieringRecordDetailsComponent;
  let fixture: ComponentFixture<PrintCashieringRecordDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashieringRecordDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashieringRecordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
