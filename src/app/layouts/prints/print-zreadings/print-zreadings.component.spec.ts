import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintZReadingsComponent } from './print-zreadings.component';

describe('PrintZReadingsComponent', () => {
  let component: PrintZReadingsComponent;
  let fixture: ComponentFixture<PrintZReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintZReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintZReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
