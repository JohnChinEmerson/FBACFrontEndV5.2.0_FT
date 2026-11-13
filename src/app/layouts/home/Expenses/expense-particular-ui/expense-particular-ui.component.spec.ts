import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseParticularUIComponent } from './expense-particular-ui.component';

describe('ExpenseParticularUIComponent', () => {
  let component: ExpenseParticularUIComponent;
  let fixture: ComponentFixture<ExpenseParticularUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseParticularUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseParticularUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
