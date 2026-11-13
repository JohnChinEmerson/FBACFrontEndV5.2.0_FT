import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableOldReceiptsUIComponent } from './receivable-old-receipts-ui.component';

describe('ReceivableOldReceiptsUIComponent', () => {
  let component: ReceivableOldReceiptsUIComponent;
  let fixture: ComponentFixture<ReceivableOldReceiptsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableOldReceiptsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableOldReceiptsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
