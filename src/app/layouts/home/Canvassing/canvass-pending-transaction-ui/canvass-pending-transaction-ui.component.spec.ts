import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassPendingTransactionUIComponent } from './canvass-pending-transaction-ui.component';

describe('CanvassPendingTransactionUIComponent', () => {
  let component: CanvassPendingTransactionUIComponent;
  let fixture: ComponentFixture<CanvassPendingTransactionUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassPendingTransactionUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassPendingTransactionUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
