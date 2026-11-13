import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailUIComponent } from './sale-detail-ui.component';

describe('SaleDetailUIComponent', () => {
  let component: SaleDetailUIComponent;
  let fixture: ComponentFixture<SaleDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
