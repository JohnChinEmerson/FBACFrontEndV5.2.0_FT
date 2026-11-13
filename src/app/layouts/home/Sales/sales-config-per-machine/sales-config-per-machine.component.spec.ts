import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConfigPerMachineComponent } from './sales-config-per-machine.component';

describe('SalesConfigPerMachineComponent', () => {
  let component: SalesConfigPerMachineComponent;
  let fixture: ComponentFixture<SalesConfigPerMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesConfigPerMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesConfigPerMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
