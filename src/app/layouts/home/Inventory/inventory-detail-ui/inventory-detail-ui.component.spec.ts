import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailUIComponent } from './inventory-detail-ui.component';

describe('InventoryDetailUIComponent', () => {
  let component: InventoryDetailUIComponent;
  let fixture: ComponentFixture<InventoryDetailUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDetailUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
