import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidatedPettyCashComponent } from './liquidated-petty-cash.component';

describe('LiquidatedPettyCashComponent', () => {
  let component: LiquidatedPettyCashComponent;
  let fixture: ComponentFixture<LiquidatedPettyCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidatedPettyCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidatedPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
