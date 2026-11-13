import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustingEntryDetailsUIComponent } from './adjusting-entry-details-ui.component';

describe('AdjustingEntryDetailsUIComponent', () => {
  let component: AdjustingEntryDetailsUIComponent;
  let fixture: ComponentFixture<AdjustingEntryDetailsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustingEntryDetailsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustingEntryDetailsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
