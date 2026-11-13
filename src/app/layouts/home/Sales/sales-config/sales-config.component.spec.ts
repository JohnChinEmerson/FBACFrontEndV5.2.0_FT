import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConfigComponent } from './sales-config.component';

describe('SalesConfigComponent', () => {
  let component: SalesConfigComponent;
  let fixture: ComponentFixture<SalesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
