import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingTransaction2Component } from './receiving-transaction2.component';

describe('ReceivingTransaction2Component', () => {
  let component: ReceivingTransaction2Component;
  let fixture: ComponentFixture<ReceivingTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
