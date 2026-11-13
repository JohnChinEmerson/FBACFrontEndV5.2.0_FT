import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementRecordsComponent } from './disbursement-records.component';

describe('DisbursementRecordsComponent', () => {
  let component: DisbursementRecordsComponent;
  let fixture: ComponentFixture<DisbursementRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
