import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPODetailsComponent } from './print-podetails.component';

describe('PrintPODetailsComponent', () => {
  let component: PrintPODetailsComponent;
  let fixture: ComponentFixture<PrintPODetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPODetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPODetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
