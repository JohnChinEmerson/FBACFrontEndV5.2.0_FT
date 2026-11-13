import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POReceiptsComponent } from './poreceipts.component';

describe('POReceiptsComponent', () => {
  let component: POReceiptsComponent;
  let fixture: ComponentFixture<POReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
