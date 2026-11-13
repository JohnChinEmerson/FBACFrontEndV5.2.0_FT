import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSignaturesComponent } from './sales-signatures.component';

describe('SalesSignaturesComponent', () => {
  let component: SalesSignaturesComponent;
  let fixture: ComponentFixture<SalesSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
