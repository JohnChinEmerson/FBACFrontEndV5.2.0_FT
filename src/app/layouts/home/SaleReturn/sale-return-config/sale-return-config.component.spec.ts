import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnConfigComponent } from './sale-return-config.component';

describe('SaleReturnConfigComponent', () => {
  let component: SaleReturnConfigComponent;
  let fixture: ComponentFixture<SaleReturnConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
