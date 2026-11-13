import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOrderReportsComponent } from './print-order-reports.component';

describe('PrintOrderReportsComponent', () => {
  let component: PrintOrderReportsComponent;
  let fixture: ComponentFixture<PrintOrderReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintOrderReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOrderReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
