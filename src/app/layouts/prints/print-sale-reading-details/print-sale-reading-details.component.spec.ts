import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReadingDetailsComponent } from './print-sale-reading-details.component';

describe('PrintSaleReadingDetailsComponent', () => {
  let component: PrintSaleReadingDetailsComponent;
  let fixture: ComponentFixture<PrintSaleReadingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReadingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReadingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
