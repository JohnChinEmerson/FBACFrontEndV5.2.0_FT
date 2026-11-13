import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStocksInquiryComponent } from './print-stocks-inquiry.component';

describe('PrintStocksInquiryComponent', () => {
  let component: PrintStocksInquiryComponent;
  let fixture: ComponentFixture<PrintStocksInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStocksInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStocksInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
