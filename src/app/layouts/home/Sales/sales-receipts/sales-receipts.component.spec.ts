import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReceiptsComponent } from './sales-receipts.component';

describe('SalesReceiptsComponent', () => {
  let component: SalesReceiptsComponent;
  let fixture: ComponentFixture<SalesReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
