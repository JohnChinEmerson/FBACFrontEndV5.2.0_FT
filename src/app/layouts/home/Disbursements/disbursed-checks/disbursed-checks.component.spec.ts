import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursedChecksComponent } from './disbursed-checks.component';

describe('DisbursedChecksComponent', () => {
  let component: DisbursedChecksComponent;
  let fixture: ComponentFixture<DisbursedChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursedChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursedChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
