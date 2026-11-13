import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustingEntriesComponent } from './adjusting-entries.component';

describe('AdjustingEntriesComponent', () => {
  let component: AdjustingEntriesComponent;
  let fixture: ComponentFixture<AdjustingEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustingEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
