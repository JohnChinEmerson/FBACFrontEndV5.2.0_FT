import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintStocksComponent } from './print-stocks.component';

describe('PrintStocksComponent', () => {
  let component: PrintStocksComponent;
  let fixture: ComponentFixture<PrintStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
