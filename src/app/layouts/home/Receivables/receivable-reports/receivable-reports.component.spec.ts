import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableReportsComponent } from './receivable-reports.component';

describe('ReceivableReportsComponent', () => {
  let component: ReceivableReportsComponent;
  let fixture: ComponentFixture<ReceivableReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
