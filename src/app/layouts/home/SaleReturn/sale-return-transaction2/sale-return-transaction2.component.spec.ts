import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnTransaction2Component } from './sale-return-transaction2.component';

describe('SaleReturnTransaction2Component', () => {
  let component: SaleReturnTransaction2Component;
  let fixture: ComponentFixture<SaleReturnTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
