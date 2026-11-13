import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingSignaturesComponent } from './receiving-signatures.component';

describe('ReceivingSignaturesComponent', () => {
  let component: ReceivingSignaturesComponent;
  let fixture: ComponentFixture<ReceivingSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
