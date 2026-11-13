import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinePermitsComponent } from './machine-permits.component';

describe('MachinePermitsComponent', () => {
  let component: MachinePermitsComponent;
  let fixture: ComponentFixture<MachinePermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachinePermitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinePermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
