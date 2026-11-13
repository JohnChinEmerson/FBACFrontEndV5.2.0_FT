import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementReportsComponent } from './disbursement-reports.component';

describe('DisbursementReportsComponent', () => {
  let component: DisbursementReportsComponent;
  let fixture: ComponentFixture<DisbursementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
