import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSignaturesComponent } from './posignatures.component';

describe('POSignaturesComponent', () => {
  let component: POSignaturesComponent;
  let fixture: ComponentFixture<POSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
