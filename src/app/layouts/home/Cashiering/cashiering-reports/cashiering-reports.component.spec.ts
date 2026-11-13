import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashieringReportsComponent } from './cashiering-reports.component';

describe('CashieringReportsComponent', () => {
  let component: CashieringReportsComponent;
  let fixture: ComponentFixture<CashieringReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashieringReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashieringReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
