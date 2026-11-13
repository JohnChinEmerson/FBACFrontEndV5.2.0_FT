import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleHeaderUIComponent } from './sale-header-ui.component';

describe('SaleHeaderUIComponent', () => {
  let component: SaleHeaderUIComponent;
  let fixture: ComponentFixture<SaleHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
