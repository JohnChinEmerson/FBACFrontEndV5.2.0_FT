import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItemsUIComponentComponent } from './upload-items-uicomponent.component';

describe('UploadItemsUIComponentComponent', () => {
  let component: UploadItemsUIComponentComponent;
  let fixture: ComponentFixture<UploadItemsUIComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadItemsUIComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItemsUIComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
