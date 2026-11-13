import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivingDetailsComponent } from './print-receiving-details.component';

describe('PrintReceivingDetailsComponent', () => {
  let component: PrintReceivingDetailsComponent;
  let fixture: ComponentFixture<PrintReceivingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
