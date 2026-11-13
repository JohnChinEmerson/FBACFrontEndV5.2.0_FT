import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashieringRecordsComponent } from './cashiering-records.component';

describe('CashieringRecordsComponent', () => {
  let component: CashieringRecordsComponent;
  let fixture: ComponentFixture<CashieringRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashieringRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashieringRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
