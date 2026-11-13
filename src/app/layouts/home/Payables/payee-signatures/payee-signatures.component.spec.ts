import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeSignaturesComponent } from './payee-signatures.component';

describe('PayeeSignaturesComponent', () => {
  let component: PayeeSignaturesComponent;
  let fixture: ComponentFixture<PayeeSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayeeSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
