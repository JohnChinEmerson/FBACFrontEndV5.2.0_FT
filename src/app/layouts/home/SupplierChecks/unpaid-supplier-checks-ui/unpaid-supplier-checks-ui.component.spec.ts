import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidSupplierChecksUIComponent } from './unpaid-supplier-checks-ui.component';

describe('UnpaidSupplierChecksUIComponent', () => {
  let component: UnpaidSupplierChecksUIComponent;
  let fixture: ComponentFixture<UnpaidSupplierChecksUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidSupplierChecksUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpaidSupplierChecksUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
