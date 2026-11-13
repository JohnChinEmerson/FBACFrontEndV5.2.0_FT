import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvassReceiptsComponent } from './canvass-receipts.component';

describe('CanvassReceiptsComponent', () => {
  let component: CanvassReceiptsComponent;
  let fixture: ComponentFixture<CanvassReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvassReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvassReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
