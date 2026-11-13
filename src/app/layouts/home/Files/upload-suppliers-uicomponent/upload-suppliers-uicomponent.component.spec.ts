import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSuppliersUIComponentComponent } from './upload-suppliers-uicomponent.component';

describe('UploadSuppliersUIComponentComponent', () => {
  let component: UploadSuppliersUIComponentComponent;
  let fixture: ComponentFixture<UploadSuppliersUIComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSuppliersUIComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSuppliersUIComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
