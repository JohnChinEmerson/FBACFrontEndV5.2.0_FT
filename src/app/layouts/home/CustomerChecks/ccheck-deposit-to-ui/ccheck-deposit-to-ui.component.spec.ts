import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCheckDepositToUIComponent } from './ccheck-deposit-to-ui.component';

describe('CCheckDepositToUIComponent', () => {
  let component: CCheckDepositToUIComponent;
  let fixture: ComponentFixture<CCheckDepositToUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCheckDepositToUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCheckDepositToUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
