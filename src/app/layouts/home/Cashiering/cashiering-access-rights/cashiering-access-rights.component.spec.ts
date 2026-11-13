import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashieringAccessRightsComponent } from './cashiering-access-rights.component';

describe('CashieringAccessRightsComponent', () => {
  let component: CashieringAccessRightsComponent;
  let fixture: ComponentFixture<CashieringAccessRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashieringAccessRightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashieringAccessRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
