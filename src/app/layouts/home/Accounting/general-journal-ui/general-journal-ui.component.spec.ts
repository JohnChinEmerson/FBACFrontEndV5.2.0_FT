import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralJournalUIComponent } from './general-journal-ui.component';

describe('GeneralJournalUIComponent', () => {
  let component: GeneralJournalUIComponent;
  let fixture: ComponentFixture<GeneralJournalUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralJournalUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralJournalUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
