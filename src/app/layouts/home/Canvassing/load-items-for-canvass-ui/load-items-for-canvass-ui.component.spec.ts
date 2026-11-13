import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItemsForCanvassUIComponent } from './load-items-for-canvass-ui.component';

describe('LoadItemsForCanvassUIComponent', () => {
  let component: LoadItemsForCanvassUIComponent;
  let fixture: ComponentFixture<LoadItemsForCanvassUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadItemsForCanvassUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItemsForCanvassUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
