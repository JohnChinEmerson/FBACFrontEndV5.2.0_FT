import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReadingComponent } from './sales-reading.component';

describe('SalesReadingComponent', () => {
  let component: SalesReadingComponent;
  let fixture: ComponentFixture<SalesReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
