import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustingEntryUIComponent } from './adjusting-entry-ui.component';

describe('AdjustingEntryUIComponent', () => {
  let component: AdjustingEntryUIComponent;
  let fixture: ComponentFixture<AdjustingEntryUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustingEntryUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustingEntryUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
