import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseForTaggingsUIComponent } from './use-for-taggings-ui.component';

describe('UseForTaggingsUIComponent', () => {
  let component: UseForTaggingsUIComponent;
  let fixture: ComponentFixture<UseForTaggingsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseForTaggingsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseForTaggingsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
