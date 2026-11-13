import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBIRDiscountsComponent } from './print-birdiscounts.component';

describe('PrintBIRDiscountsComponent', () => {
  let component: PrintBIRDiscountsComponent;
  let fixture: ComponentFixture<PrintBIRDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBIRDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBIRDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
