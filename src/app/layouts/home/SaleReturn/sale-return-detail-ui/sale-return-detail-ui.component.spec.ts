import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnDetailUIComponent } from './sale-return-detail-ui.component';

describe('SaleReturnDetailUIComponent', () => {
  let component: SaleReturnDetailUIComponent;
  let fixture: ComponentFixture<SaleReturnDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
