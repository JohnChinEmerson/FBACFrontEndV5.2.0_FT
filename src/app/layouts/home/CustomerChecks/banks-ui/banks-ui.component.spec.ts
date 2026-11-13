import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksUIComponent } from './banks-ui.component';

describe('BanksUIComponent', () => {
  let component: BanksUIComponent;
  let fixture: ComponentFixture<BanksUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanksUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
