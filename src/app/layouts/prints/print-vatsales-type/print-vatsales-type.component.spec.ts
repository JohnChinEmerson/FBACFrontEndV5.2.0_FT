import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVATSalesTypeComponent } from './print-vatsales-type.component';

describe('PrintVATSalesTypeComponent', () => {
  let component: PrintVATSalesTypeComponent;
  let fixture: ComponentFixture<PrintVATSalesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintVATSalesTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVATSalesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
