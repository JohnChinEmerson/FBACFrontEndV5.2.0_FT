import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashieringConfigComponent } from './cashiering-config.component';

describe('CashieringConfigComponent', () => {
  let component: CashieringConfigComponent;
  let fixture: ComponentFixture<CashieringConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashieringConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashieringConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
