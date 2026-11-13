import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VATSaleTypesComponent } from './vatsale-types.component';

describe('VATSaleTypesComponent', () => {
  let component: VATSaleTypesComponent;
  let fixture: ComponentFixture<VATSaleTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VATSaleTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VATSaleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
