import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleReturnDetailsComponent } from './print-sale-return-details.component';

describe('PrintSaleReturnDetailsComponent', () => {
  let component: PrintSaleReturnDetailsComponent;
  let fixture: ComponentFixture<PrintSaleReturnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleReturnDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
