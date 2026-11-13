import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingConfigComponent } from './receiving-config.component';

describe('ReceivingConfigComponent', () => {
  let component: ReceivingConfigComponent;
  let fixture: ComponentFixture<ReceivingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
