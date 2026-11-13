import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStocksExpiryComponent } from './print-stocks-expiry.component';

describe('PrintStocksExpiryComponent', () => {
  let component: PrintStocksExpiryComponent;
  let fixture: ComponentFixture<PrintStocksExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStocksExpiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStocksExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
