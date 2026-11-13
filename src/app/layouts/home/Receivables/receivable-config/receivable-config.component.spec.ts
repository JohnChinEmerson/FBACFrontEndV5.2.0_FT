import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableConfigComponent } from './receivable-config.component';

describe('ReceivableConfigComponent', () => {
  let component: ReceivableConfigComponent;
  let fixture: ComponentFixture<ReceivableConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
