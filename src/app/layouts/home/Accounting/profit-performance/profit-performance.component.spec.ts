import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitPerformanceComponent } from './profit-performance.component';

describe('ProfitPerformanceComponent', () => {
  let component: ProfitPerformanceComponent;
  let fixture: ComponentFixture<ProfitPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
