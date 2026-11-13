import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidateUIComponent } from './liquidate-ui.component';

describe('LiquidateUIComponent', () => {
  let component: LiquidateUIComponent;
  let fixture: ComponentFixture<LiquidateUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidateUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidateUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
