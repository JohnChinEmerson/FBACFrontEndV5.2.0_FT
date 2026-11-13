import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksExpiryComponent } from './stocks-expiry.component';

describe('StocksExpiryComponent', () => {
  let component: StocksExpiryComponent;
  let fixture: ComponentFixture<StocksExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksExpiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
