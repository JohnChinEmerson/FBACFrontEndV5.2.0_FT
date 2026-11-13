import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisbursedChecksComponent } from './print-disbursed-checks.component';

describe('PrintDisbursedChecksComponent', () => {
  let component: PrintDisbursedChecksComponent;
  let fixture: ComponentFixture<PrintDisbursedChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDisbursedChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisbursedChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
