import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositToUIComponent } from './deposit-to-ui.component';

describe('DepositToUIComponent', () => {
  let component: DepositToUIComponent;
  let fixture: ComponentFixture<DepositToUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositToUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositToUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
