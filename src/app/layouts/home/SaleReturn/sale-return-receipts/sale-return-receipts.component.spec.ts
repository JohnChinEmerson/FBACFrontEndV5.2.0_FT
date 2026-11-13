import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnReceiptsComponent } from './sale-return-receipts.component';

describe('SaleReturnReceiptsComponent', () => {
  let component: SaleReturnReceiptsComponent;
  let fixture: ComponentFixture<SaleReturnReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
