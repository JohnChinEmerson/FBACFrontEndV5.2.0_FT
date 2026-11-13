import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutSerialNosUIComponent } from './out-serial-nos-ui.component';

describe('OutSerialNosUIComponent', () => {
  let component: OutSerialNosUIComponent;
  let fixture: ComponentFixture<OutSerialNosUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutSerialNosUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutSerialNosUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
