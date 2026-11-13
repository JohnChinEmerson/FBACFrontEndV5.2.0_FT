import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCustomersUIComponentComponent } from './upload-customers-uicomponent.component';

describe('UploadCustomersUIComponentComponent', () => {
  let component: UploadCustomersUIComponentComponent;
  let fixture: ComponentFixture<UploadCustomersUIComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCustomersUIComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCustomersUIComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
