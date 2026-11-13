import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintXReadingPOSComponent } from './print-xreading-pos.component';

describe('PrintXReadingPOSComponent', () => {
  let component: PrintXReadingPOSComponent;
  let fixture: ComponentFixture<PrintXReadingPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintXReadingPOSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintXReadingPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
