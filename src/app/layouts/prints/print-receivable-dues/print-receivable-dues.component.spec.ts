import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivableDuesComponent } from './print-receivable-dues.component';

describe('PrintReceivableDuesComponent', () => {
  let component: PrintReceivableDuesComponent;
  let fixture: ComponentFixture<PrintReceivableDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReceivableDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivableDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
