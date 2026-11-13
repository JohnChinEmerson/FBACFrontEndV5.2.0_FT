import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCashReadingComponent } from './print-cash-reading.component';

describe('PrintCashReadingComponent', () => {
  let component: PrintCashReadingComponent;
  let fixture: ComponentFixture<PrintCashReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCashReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCashReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
