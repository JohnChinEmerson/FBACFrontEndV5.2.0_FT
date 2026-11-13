import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffsetFromPettyCashUIComponent } from './offset-from-petty-cash-ui.component';

describe('OffsetFromPettyCashUIComponent', () => {
  let component: OffsetFromPettyCashUIComponent;
  let fixture: ComponentFixture<OffsetFromPettyCashUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffsetFromPettyCashUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffsetFromPettyCashUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
