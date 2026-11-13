import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSPrintCashReadingComponent } from './posprint-cash-reading.component';

describe('POSPrintCashReadingComponent', () => {
  let component: POSPrintCashReadingComponent;
  let fixture: ComponentFixture<POSPrintCashReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSPrintCashReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSPrintCashReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
