import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintESalesBookComponent } from './print-esales-book.component';

describe('PrintESalesBookComponent', () => {
  let component: PrintESalesBookComponent;
  let fixture: ComponentFixture<PrintESalesBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintESalesBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintESalesBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
