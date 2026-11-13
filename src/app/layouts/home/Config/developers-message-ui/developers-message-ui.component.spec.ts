import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopersMessageUIComponent } from './developers-message-ui.component';

describe('DevelopersMessageUIComponent', () => {
  let component: DevelopersMessageUIComponent;
  let fixture: ComponentFixture<DevelopersMessageUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevelopersMessageUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopersMessageUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
