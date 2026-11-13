import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptedRedirectComponent } from './encrypted-redirect.component';

describe('EncryptedRedirectComponent', () => {
  let component: EncryptedRedirectComponent;
  let fixture: ComponentFixture<EncryptedRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncryptedRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptedRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
