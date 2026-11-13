import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingJournalComponent } from './receiving-journal.component';

describe('ReceivingJournalComponent', () => {
  let component: ReceivingJournalComponent;
  let fixture: ComponentFixture<ReceivingJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivingJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
