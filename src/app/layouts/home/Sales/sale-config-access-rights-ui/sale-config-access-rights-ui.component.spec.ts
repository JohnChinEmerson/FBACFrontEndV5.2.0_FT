import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleConfigAccessRightsUIComponent } from './sale-config-access-rights-ui.component';

describe('SaleConfigAccessRightsUIComponent', () => {
  let component: SaleConfigAccessRightsUIComponent;
  let fixture: ComponentFixture<SaleConfigAccessRightsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleConfigAccessRightsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleConfigAccessRightsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
