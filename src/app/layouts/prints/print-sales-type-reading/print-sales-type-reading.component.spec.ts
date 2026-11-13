import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSalesTypeReadingComponent } from './print-sales-type-reading.component';

describe('PrintSalesTypeReadingComponent', () => {
  let component: PrintSalesTypeReadingComponent;
  let fixture: ComponentFixture<PrintSalesTypeReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSalesTypeReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSalesTypeReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
