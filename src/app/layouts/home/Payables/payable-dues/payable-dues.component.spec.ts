import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableDuesComponent } from './payable-dues.component';

describe('PayableDuesComponent', () => {
  let component: PayableDuesComponent;
  let fixture: ComponentFixture<PayableDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
