import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnSignaturesComponent } from './sale-return-signatures.component';

describe('SaleReturnSignaturesComponent', () => {
  let component: SaleReturnSignaturesComponent;
  let fixture: ComponentFixture<SaleReturnSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
