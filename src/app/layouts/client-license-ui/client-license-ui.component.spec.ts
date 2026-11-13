import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLicenseUIComponent } from './client-license-ui.component';

describe('ClientLicenseUIComponent', () => {
  let component: ClientLicenseUIComponent;
  let fixture: ComponentFixture<ClientLicenseUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientLicenseUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLicenseUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
