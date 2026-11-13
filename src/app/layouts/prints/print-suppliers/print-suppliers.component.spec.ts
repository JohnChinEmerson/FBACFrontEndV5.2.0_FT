import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSuppliersComponent } from './print-suppliers.component';

describe('PrintSuppliersComponent', () => {
  let component: PrintSuppliersComponent;
  let fixture: ComponentFixture<PrintSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
