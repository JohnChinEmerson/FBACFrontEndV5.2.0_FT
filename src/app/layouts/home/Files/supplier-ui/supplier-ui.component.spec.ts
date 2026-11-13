import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUIComponent } from './supplier-ui.component';

describe('SupplierUIComponent', () => {
  let component: SupplierUIComponent;
  let fixture: ComponentFixture<SupplierUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
