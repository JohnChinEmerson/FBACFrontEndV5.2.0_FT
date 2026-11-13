import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReceiptsComponent } from './print-sale-receipts.component';

describe('PrintSaleReceiptsComponent', () => {
  let component: PrintSaleReceiptsComponent;
  let fixture: ComponentFixture<PrintSaleReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
