import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableConfigComponent } from './payable-config.component';

describe('PayableConfigComponent', () => {
  let component: PayableConfigComponent;
  let fixture: ComponentFixture<PayableConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
