import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableReportsComponent } from './payable-reports.component';

describe('PayableReportsComponent', () => {
  let component: PayableReportsComponent;
  let fixture: ComponentFixture<PayableReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
