import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BIRDiscountsComponent } from './birdiscounts.component';

describe('BIRDiscountsComponent', () => {
  let component: BIRDiscountsComponent;
  let fixture: ComponentFixture<BIRDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BIRDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BIRDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
