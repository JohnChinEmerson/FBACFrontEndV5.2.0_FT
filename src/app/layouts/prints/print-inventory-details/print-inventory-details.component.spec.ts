import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInventoryDetailsComponent } from './print-inventory-details.component';

describe('PrintInventoryDetailsComponent', () => {
  let component: PrintInventoryDetailsComponent;
  let fixture: ComponentFixture<PrintInventoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInventoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
