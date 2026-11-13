import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SRSerialNosUIComponent } from './srserial-nos-ui.component';

describe('SRSerialNosUIComponent', () => {
  let component: SRSerialNosUIComponent;
  let fixture: ComponentFixture<SRSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SRSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SRSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
