import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintItemsComponent } from './print-items.component';

describe('PrintItemsComponent', () => {
  let component: PrintItemsComponent;
  let fixture: ComponentFixture<PrintItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
