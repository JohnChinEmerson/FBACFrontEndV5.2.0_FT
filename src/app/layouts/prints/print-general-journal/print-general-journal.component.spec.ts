import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGeneralJournalComponent } from './print-general-journal.component';

describe('PrintGeneralJournalComponent', () => {
  let component: PrintGeneralJournalComponent;
  let fixture: ComponentFixture<PrintGeneralJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintGeneralJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintGeneralJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
