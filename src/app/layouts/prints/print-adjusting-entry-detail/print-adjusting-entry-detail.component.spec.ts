import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAdjustingEntryDetailComponent } from './print-adjusting-entry-detail.component';

describe('PrintAdjustingEntryDetailComponent', () => {
  let component: PrintAdjustingEntryDetailComponent;
  let fixture: ComponentFixture<PrintAdjustingEntryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintAdjustingEntryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAdjustingEntryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
