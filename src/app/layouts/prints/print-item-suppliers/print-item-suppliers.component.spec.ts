import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemSuppliersComponent } from './print-item-suppliers.component';

describe('PrintItemSuppliersComponent', () => {
  let component: PrintItemSuppliersComponent;
  let fixture: ComponentFixture<PrintItemSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
