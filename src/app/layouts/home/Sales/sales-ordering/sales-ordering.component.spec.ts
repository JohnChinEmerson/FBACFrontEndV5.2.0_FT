import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderingComponent } from './sales-ordering.component';

describe('SalesOrderingComponent', () => {
  let component: SalesOrderingComponent;
  let fixture: ComponentFixture<SalesOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
