import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionBoxUIComponent } from './suggestion-box-ui.component';

describe('SuggestionBoxUIComponent', () => {
  let component: SuggestionBoxUIComponent;
  let fixture: ComponentFixture<SuggestionBoxUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestionBoxUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionBoxUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
