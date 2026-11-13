import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementRequestsComponent } from './disbursement-requests.component';

describe('DisbursementRequestsComponent', () => {
  let component: DisbursementRequestsComponent;
  let fixture: ComponentFixture<DisbursementRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
