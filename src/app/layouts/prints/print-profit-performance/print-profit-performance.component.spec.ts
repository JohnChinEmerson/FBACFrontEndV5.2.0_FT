import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProfitPerformanceComponent } from './print-profit-performance.component';

describe('PrintProfitPerformanceComponent', () => {
  let component: PrintProfitPerformanceComponent;
  let fixture: ComponentFixture<PrintProfitPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintProfitPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProfitPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
