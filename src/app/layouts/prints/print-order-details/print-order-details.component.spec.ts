import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOrderDetailsComponent } from './print-order-details.component';

describe('PrintOrderDetailsComponent', () => {
  let component: PrintOrderDetailsComponent;
  let fixture: ComponentFixture<PrintOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
