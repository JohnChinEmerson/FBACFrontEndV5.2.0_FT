import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailsUIComponent } from './inventory-details-ui.component';

describe('InventoryDetailsUIComponent', () => {
  let component: InventoryDetailsUIComponent;
  let fixture: ComponentFixture<InventoryDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
