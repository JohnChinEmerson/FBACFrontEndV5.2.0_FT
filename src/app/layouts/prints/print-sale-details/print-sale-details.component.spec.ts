import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleDetailsComponent } from './print-sale-details.component';

describe('PrintSaleDetailsComponent', () => {
  let component: PrintSaleDetailsComponent;
  let fixture: ComponentFixture<PrintSaleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
