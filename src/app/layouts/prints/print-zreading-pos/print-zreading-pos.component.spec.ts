import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintZReadingPOSComponent } from './print-zreading-pos.component';

describe('PrintZReadingPOSComponent', () => {
  let component: PrintZReadingPOSComponent;
  let fixture: ComponentFixture<PrintZReadingPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintZReadingPOSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintZReadingPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
