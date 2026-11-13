import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryConfigUIComponent } from './inventory-config-ui.component';

describe('InventoryConfigUIComponent', () => {
  let component: InventoryConfigUIComponent;
  let fixture: ComponentFixture<InventoryConfigUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryConfigUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryConfigUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
