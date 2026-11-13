import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCountUIComponent } from './cash-count-ui.component';

describe('CashCountUIComponent', () => {
  let component: CashCountUIComponent;
  let fixture: ComponentFixture<CashCountUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashCountUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCountUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
