import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCashieringComponent } from './sales-cashiering.component';

describe('SalesCashieringComponent', () => {
  let component: SalesCashieringComponent;
  let fixture: ComponentFixture<SalesCashieringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesCashieringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCashieringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
