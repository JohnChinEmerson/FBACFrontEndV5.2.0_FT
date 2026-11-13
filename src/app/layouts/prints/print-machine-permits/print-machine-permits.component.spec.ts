import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMachinePermitsComponent } from './print-machine-permits.component';

describe('PrintMachinePermitsComponent', () => {
  let component: PrintMachinePermitsComponent;
  let fixture: ComponentFixture<PrintMachinePermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMachinePermitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMachinePermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
