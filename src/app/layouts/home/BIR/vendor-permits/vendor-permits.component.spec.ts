import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPermitsComponent } from './vendor-permits.component';

describe('VendorPermitsComponent', () => {
  let component: VendorPermitsComponent;
  let fixture: ComponentFixture<VendorPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorPermitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
