import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStocksTransferUIComponent } from './load-stocks-transfer-ui.component';

describe('LoadStocksTransferUIComponent', () => {
  let component: LoadStocksTransferUIComponent;
  let fixture: ComponentFixture<LoadStocksTransferUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadStocksTransferUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadStocksTransferUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
