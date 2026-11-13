import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPayableDuesComponent } from './print-payable-dues.component';

describe('PrintPayableDuesComponent', () => {
  let component: PrintPayableDuesComponent;
  let fixture: ComponentFixture<PrintPayableDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPayableDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPayableDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
