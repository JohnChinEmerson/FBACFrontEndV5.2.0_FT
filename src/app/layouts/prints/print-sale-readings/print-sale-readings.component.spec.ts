import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReadingsComponent } from './print-sale-readings.component';

describe('PrintSaleReadingsComponent', () => {
  let component: PrintSaleReadingsComponent;
  let fixture: ComponentFixture<PrintSaleReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
