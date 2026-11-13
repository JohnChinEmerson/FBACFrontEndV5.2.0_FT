import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStocksTotalsComponent } from './print-stocks-totals.component';

describe('PrintStocksTotalsComponent', () => {
  let component: PrintStocksTotalsComponent;
  let fixture: ComponentFixture<PrintStocksTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStocksTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStocksTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
