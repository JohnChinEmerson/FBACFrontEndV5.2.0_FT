import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnliquidatedPettyCashComponent } from './unliquidated-petty-cash.component';

describe('UnliquidatedPettyCashComponent', () => {
  let component: UnliquidatedPettyCashComponent;
  let fixture: ComponentFixture<UnliquidatedPettyCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnliquidatedPettyCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnliquidatedPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
