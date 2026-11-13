import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingHeaderUIComponent } from './receiving-header-ui.component';

describe('ReceivingHeaderUIComponent', () => {
  let component: ReceivingHeaderUIComponent;
  let fixture: ComponentFixture<ReceivingHeaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingHeaderUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingHeaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
