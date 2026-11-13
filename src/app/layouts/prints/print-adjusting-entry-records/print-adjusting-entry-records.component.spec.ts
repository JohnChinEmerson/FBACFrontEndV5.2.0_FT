import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAdjustingEntryRecordsComponent } from './print-adjusting-entry-records.component';

describe('PrintAdjustingEntryRecordsComponent', () => {
  let component: PrintAdjustingEntryRecordsComponent;
  let fixture: ComponentFixture<PrintAdjustingEntryRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintAdjustingEntryRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAdjustingEntryRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
