import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableOldReceiptsUIComponent } from './payable-old-receipts-ui.component';

describe('PayableOldReceiptsUIComponent', () => {
  let component: PayableOldReceiptsUIComponent;
  let fixture: ComponentFixture<PayableOldReceiptsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableOldReceiptsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableOldReceiptsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
