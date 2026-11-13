import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureUIComponent } from './signature-ui.component';

describe('SignatureUIComponent', () => {
  let component: SignatureUIComponent;
  let fixture: ComponentFixture<SignatureUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
