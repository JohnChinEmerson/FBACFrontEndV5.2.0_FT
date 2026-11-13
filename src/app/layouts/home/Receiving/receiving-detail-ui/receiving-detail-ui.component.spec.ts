import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingDetailUIComponent } from './receiving-detail-ui.component';

describe('ReceivingDetailUIComponent', () => {
  let component: ReceivingDetailUIComponent;
  let fixture: ComponentFixture<ReceivingDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
