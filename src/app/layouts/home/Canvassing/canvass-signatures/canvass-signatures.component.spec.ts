import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassSignaturesComponent } from './canvass-signatures.component';

describe('CanvassSignaturesComponent', () => {
  let component: CanvassSignaturesComponent;
  let fixture: ComponentFixture<CanvassSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
