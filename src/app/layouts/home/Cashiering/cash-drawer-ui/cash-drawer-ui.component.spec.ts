import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDrawerUIComponent } from './cash-drawer-ui.component';

describe('CashDrawerUIComponent', () => {
  let component: CashDrawerUIComponent;
  let fixture: ComponentFixture<CashDrawerUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashDrawerUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashDrawerUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
