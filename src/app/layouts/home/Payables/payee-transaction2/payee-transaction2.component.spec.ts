import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeTransaction2Component } from './payee-transaction2.component';

describe('PayeeTransaction2Component', () => {
  let component: PayeeTransaction2Component;
  let fixture: ComponentFixture<PayeeTransaction2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeTransaction2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeTransaction2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
