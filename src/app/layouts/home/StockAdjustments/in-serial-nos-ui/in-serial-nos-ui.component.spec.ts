import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InSerialNosUIComponent } from './in-serial-nos-ui.component';

describe('InSerialNosUIComponent', () => {
  let component: InSerialNosUIComponent;
  let fixture: ComponentFixture<InSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
