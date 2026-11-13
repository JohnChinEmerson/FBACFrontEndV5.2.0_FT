import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnDetailsUIComponent } from './sale-return-details-ui.component';

describe('SaleReturnDetailsUIComponent', () => {
  let component: SaleReturnDetailsUIComponent;
  let fixture: ComponentFixture<SaleReturnDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
