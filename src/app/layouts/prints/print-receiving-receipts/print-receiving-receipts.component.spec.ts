import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivingReceiptsComponent } from './print-receiving-receipts.component';

describe('PrintReceivingReceiptsComponent', () => {
  let component: PrintReceivingReceiptsComponent;
  let fixture: ComponentFixture<PrintReceivingReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivingReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivingReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
