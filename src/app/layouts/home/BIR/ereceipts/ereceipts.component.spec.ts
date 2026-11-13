import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EReceiptsComponent } from './ereceipts.component';

describe('EReceiptsComponent', () => {
  let component: EReceiptsComponent;
  let fixture: ComponentFixture<EReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
