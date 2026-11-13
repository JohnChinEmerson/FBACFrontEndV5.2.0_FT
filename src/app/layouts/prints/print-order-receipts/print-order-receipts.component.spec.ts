import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOrderReceiptsComponent } from './print-order-receipts.component';

describe('PrintOrderReceiptsComponent', () => {
  let component: PrintOrderReceiptsComponent;
  let fixture: ComponentFixture<PrintOrderReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintOrderReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOrderReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
