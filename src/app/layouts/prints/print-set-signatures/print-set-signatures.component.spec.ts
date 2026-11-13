import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSetSignaturesComponent } from './print-set-signatures.component';

describe('PrintSetSignaturesComponent', () => {
  let component: PrintSetSignaturesComponent;
  let fixture: ComponentFixture<PrintSetSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSetSignaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSetSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
