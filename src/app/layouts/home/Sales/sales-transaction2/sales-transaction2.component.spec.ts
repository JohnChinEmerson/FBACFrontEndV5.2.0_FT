import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTransaction2Component } from './sales-transaction2.component';

describe('SalesTransaction2Component', () => {
  let component: SalesTransaction2Component;
  let fixture: ComponentFixture<SalesTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
