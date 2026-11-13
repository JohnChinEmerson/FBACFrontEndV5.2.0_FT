import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInventoryHistoryComponent } from './print-inventory-history.component';

describe('PrintInventoryHistoryComponent', () => {
  let component: PrintInventoryHistoryComponent;
  let fixture: ComponentFixture<PrintInventoryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInventoryHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInventoryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
