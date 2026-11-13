import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupportUIComponent } from './contact-support-ui.component';

describe('ContactSupportUIComponent', () => {
  let component: ContactSupportUIComponent;
  let fixture: ComponentFixture<ContactSupportUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSupportUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSupportUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
