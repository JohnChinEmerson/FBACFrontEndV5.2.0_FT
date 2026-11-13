import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprintFooterComponent } from './aprint-footer.component';

describe('AprintFooterComponent', () => {
  let component: AprintFooterComponent;
  let fixture: ComponentFixture<AprintFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprintFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprintFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
