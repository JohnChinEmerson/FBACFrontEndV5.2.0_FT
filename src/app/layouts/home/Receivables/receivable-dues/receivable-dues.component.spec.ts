import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableDuesComponent } from './receivable-dues.component';

describe('ReceivableDuesComponent', () => {
  let component: ReceivableDuesComponent;
  let fixture: ComponentFixture<ReceivableDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
