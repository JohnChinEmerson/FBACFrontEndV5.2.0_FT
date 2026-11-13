import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingDetailsUIComponent } from './receiving-details-ui.component';

describe('ReceivingDetailsUIComponent', () => {
  let component: ReceivingDetailsUIComponent;
  let fixture: ComponentFixture<ReceivingDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
