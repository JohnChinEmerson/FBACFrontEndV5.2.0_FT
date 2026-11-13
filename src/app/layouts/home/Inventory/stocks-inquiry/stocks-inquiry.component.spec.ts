import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksInquiryComponent } from './stocks-inquiry.component';

describe('StocksInquiryComponent', () => {
  let component: StocksInquiryComponent;
  let fixture: ComponentFixture<StocksInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
