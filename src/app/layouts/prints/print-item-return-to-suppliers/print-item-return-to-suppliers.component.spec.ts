import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemReturnToSuppliersComponent } from './print-item-return-to-suppliers.component';

describe('PrintItemReturnToSuppliersComponent', () => {
  let component: PrintItemReturnToSuppliersComponent;
  let fixture: ComponentFixture<PrintItemReturnToSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemReturnToSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemReturnToSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
