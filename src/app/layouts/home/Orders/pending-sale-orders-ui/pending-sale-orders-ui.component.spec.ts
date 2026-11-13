import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSaleOrdersUIComponent } from './pending-sale-orders-ui.component';

describe('PendingSaleOrdersUIComponent', () => {
  let component: PendingSaleOrdersUIComponent;
  let fixture: ComponentFixture<PendingSaleOrdersUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSaleOrdersUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSaleOrdersUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
