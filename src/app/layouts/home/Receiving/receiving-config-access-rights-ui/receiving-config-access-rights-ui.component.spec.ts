import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingConfigAccessRightsUIComponent } from './receiving-config-access-rights-ui.component';

describe('ReceivingConfigAccessRightsUIComponent', () => {
  let component: ReceivingConfigAccessRightsUIComponent;
  let fixture: ComponentFixture<ReceivingConfigAccessRightsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingConfigAccessRightsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingConfigAccessRightsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
