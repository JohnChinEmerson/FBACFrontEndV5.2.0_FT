import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForReceivingUIComponent } from './load-items-for-receiving-ui.component';

describe('LoadItemsForReceivingUIComponent', () => {
  let component: LoadItemsForReceivingUIComponent;
  let fixture: ComponentFixture<LoadItemsForReceivingUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForReceivingUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForReceivingUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
