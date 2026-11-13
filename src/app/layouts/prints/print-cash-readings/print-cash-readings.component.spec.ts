import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashReadingsComponent } from './print-cash-readings.component';

describe('PrintCashReadingsComponent', () => {
  let component: PrintCashReadingsComponent;
  let fixture: ComponentFixture<PrintCashReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
