import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnHeaderUIComponent } from './sale-return-header-ui.component';

describe('SaleReturnHeaderUIComponent', () => {
  let component: SaleReturnHeaderUIComponent;
  let fixture: ComponentFixture<SaleReturnHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
