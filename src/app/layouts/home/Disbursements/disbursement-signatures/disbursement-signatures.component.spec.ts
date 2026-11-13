import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementSignaturesComponent } from './disbursement-signatures.component';

describe('DisbursementSignaturesComponent', () => {
  let component: DisbursementSignaturesComponent;
  let fixture: ComponentFixture<DisbursementSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
