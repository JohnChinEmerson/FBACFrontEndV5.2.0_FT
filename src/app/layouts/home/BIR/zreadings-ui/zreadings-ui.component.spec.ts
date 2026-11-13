import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZReadingsUIComponent } from './zreadings-ui.component';

describe('ZReadingsUIComponent', () => {
  let component: ZReadingsUIComponent;
  let fixture: ComponentFixture<ZReadingsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZReadingsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZReadingsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
