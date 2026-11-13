import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POPendingTransactionsUIComponent } from './popending-transactions-ui.component';

describe('POPendingTransactionsUIComponent', () => {
  let component: POPendingTransactionsUIComponent;
  let fixture: ComponentFixture<POPendingTransactionsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POPendingTransactionsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POPendingTransactionsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
