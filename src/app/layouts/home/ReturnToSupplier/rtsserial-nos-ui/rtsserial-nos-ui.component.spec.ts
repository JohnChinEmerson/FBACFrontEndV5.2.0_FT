import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTSSerialNosUIComponent } from './rtsserial-nos-ui.component';

describe('RTSSerialNosUIComponent', () => {
  let component: RTSSerialNosUIComponent;
  let fixture: ComponentFixture<RTSSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTSSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTSSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
