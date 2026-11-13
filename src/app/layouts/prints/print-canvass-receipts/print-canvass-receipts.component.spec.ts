import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCanvassReceiptsComponent } from './print-canvass-receipts.component';

describe('PrintCanvassReceiptsComponent', () => {
  let component: PrintCanvassReceiptsComponent;
  let fixture: ComponentFixture<PrintCanvassReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCanvassReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCanvassReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
