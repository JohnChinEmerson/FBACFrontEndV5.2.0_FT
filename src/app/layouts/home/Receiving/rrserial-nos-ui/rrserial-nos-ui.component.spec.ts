import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RRSerialNosUIComponent } from './rrserial-nos-ui.component';

describe('RRSerialNosUIComponent', () => {
  let component: RRSerialNosUIComponent;
  let fixture: ComponentFixture<RRSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RRSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RRSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
