import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAccountingEntryComponent } from './print-accounting-entry.component';

describe('PrintAccountingEntryComponent', () => {
  let component: PrintAccountingEntryComponent;
  let fixture: ComponentFixture<PrintAccountingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintAccountingEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAccountingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
