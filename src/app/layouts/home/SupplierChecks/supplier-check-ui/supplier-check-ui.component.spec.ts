import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCheckUIComponent } from './supplier-check-ui.component';

describe('SupplierCheckUIComponent', () => {
  let component: SupplierCheckUIComponent;
  let fixture: ComponentFixture<SupplierCheckUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierCheckUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCheckUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
