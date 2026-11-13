import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDrawerComponent } from './cash-drawer.component';

describe('CashDrawerComponent', () => {
  let component: CashDrawerComponent;
  let fixture: ComponentFixture<CashDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
