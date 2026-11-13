import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNosUIComponent } from './serial-nos-ui.component';

describe('SerialNosUIComponent', () => {
  let component: SerialNosUIComponent;
  let fixture: ComponentFixture<SerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
