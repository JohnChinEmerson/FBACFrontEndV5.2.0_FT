import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPOSBIRComponent } from './print-posbir.component';

describe('PrintPOSBIRComponent', () => {
  let component: PrintPOSBIRComponent;
  let fixture: ComponentFixture<PrintPOSBIRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPOSBIRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPOSBIRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
