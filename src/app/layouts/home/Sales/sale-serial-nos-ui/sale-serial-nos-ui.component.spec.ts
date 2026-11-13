import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSerialNosUIComponent } from './sale-serial-nos-ui.component';

describe('SaleSerialNosUIComponent', () => {
  let component: SaleSerialNosUIComponent;
  let fixture: ComponentFixture<SaleSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
