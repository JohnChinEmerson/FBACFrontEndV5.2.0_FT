import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentSignaturesComponent } from './adjustment-signatures.component';

describe('AdjustmentSignaturesComponent', () => {
  let component: AdjustmentSignaturesComponent;
  let fixture: ComponentFixture<AdjustmentSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
