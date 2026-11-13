import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMachinePermitComponent } from './selected-machine-permit.component';

describe('SelectedMachinePermitComponent', () => {
  let component: SelectedMachinePermitComponent;
  let fixture: ComponentFixture<SelectedMachinePermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedMachinePermitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedMachinePermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
