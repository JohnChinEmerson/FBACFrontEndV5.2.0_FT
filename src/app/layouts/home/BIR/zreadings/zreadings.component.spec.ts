import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZReadingsComponent } from './zreadings.component';

describe('ZReadingsComponent', () => {
  let component: ZReadingsComponent;
  let fixture: ComponentFixture<ZReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
