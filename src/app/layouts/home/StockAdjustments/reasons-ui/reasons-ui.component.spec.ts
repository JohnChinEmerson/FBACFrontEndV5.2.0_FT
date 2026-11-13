import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonsUIComponent } from './reasons-ui.component';

describe('ReasonsUIComponent', () => {
  let component: ReasonsUIComponent;
  let fixture: ComponentFixture<ReasonsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
