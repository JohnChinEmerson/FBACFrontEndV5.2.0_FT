import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPOSComponent } from './print-pos.component';

describe('PrintPOSComponent', () => {
  let component: PrintPOSComponent;
  let fixture: ComponentFixture<PrintPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPOSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
