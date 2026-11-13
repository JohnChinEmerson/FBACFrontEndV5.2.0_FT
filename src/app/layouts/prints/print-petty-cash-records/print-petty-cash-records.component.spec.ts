import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPettyCashRecordsComponent } from './print-petty-cash-records.component';

describe('PrintPettyCashRecordsComponent', () => {
  let component: PrintPettyCashRecordsComponent;
  let fixture: ComponentFixture<PrintPettyCashRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPettyCashRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPettyCashRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
