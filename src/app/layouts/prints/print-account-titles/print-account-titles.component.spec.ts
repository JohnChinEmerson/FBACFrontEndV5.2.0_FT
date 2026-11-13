import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAccountTitlesComponent } from './print-account-titles.component';

describe('PrintAccountTitlesComponent', () => {
  let component: PrintAccountTitlesComponent;
  let fixture: ComponentFixture<PrintAccountTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintAccountTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAccountTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
