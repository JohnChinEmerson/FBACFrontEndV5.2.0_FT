import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPOReceiptsComponent } from './print-poreceipts.component';

describe('PrintPOReceiptsComponent', () => {
  let component: PrintPOReceiptsComponent;
  let fixture: ComponentFixture<PrintPOReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPOReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPOReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
