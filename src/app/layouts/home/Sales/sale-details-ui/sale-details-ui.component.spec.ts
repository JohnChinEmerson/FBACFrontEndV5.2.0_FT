import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailsUIComponent } from './sale-details-ui.component';

describe('SaleDetailsUIComponent', () => {
  let component: SaleDetailsUIComponent;
  let fixture: ComponentFixture<SaleDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
