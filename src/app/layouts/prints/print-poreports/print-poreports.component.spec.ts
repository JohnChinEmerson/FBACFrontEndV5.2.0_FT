import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPOReportsComponent } from './print-poreports.component';

describe('PrintPOReportsComponent', () => {
  let component: PrintPOReportsComponent;
  let fixture: ComponentFixture<PrintPOReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPOReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPOReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
