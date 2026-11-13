import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/Material/Material.module';
import { AuthService } from 'src/app/services/auth.service';

import { UserGuideComponent } from './user-guide.component';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;

  // the logged-in edition is whatever AuthService.Edition returns (the value sent in the Edition header)
  function open(edition: string | null): void {
    TestBed.configureTestingModule({
      declarations: [UserGuideComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      providers: [{ provide: AuthService, useValue: { Edition: edition } }]
    });
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('shows only the guide of the logged-in edition', () => {
    const cases: [string, string][] = [
      ['ENTERPRISE', 'enterprise'], ['Standard', 'standard'], ['express', 'express'], ['POS', 'pos'],
      ['POS/BIR', 'posbir'], ['POS/BIR BACK OFFICE', 'posbirbo']
    ];
    for (const [edition, key] of cases) {
      TestBed.resetTestingModule();
      open(edition);
      expect(component.singleEdition).withContext(edition).toBeTrue();
      expect(component.editions.map(e => e.key)).withContext(edition).toEqual([key as any]);
    }
  });

  it('shows every edition for NA, Default, empty and unknown editions', () => {
    for (const edition of ['NA', 'DEFAULT', 'default', '', null, 'something else']) {
      TestBed.resetTestingModule();
      open(edition);
      expect(component.singleEdition).withContext(String(edition)).toBeFalse();
      expect(component.editions.map(e => e.key)).withContext(String(edition))
        .toEqual(['enterprise', 'standard', 'express', 'pos', 'posbir', 'posbirbo']);
    }
  });

  it('builds a non-empty guide for each edition and finds a topic by search', () => {
    open('NA');
    for (const ed of component.editions) {
      expect(ed.topicCount).withContext(ed.key).toBeGreaterThan(20);
      expect(ed.selected).withContext(ed.key).not.toBeNull();
    }
    const ent = component.editions[0];
    component.onSearch(ent, 'kitchen queue');
    expect(ent.hits!.some(h => h.node.t === 'Kitchen Queue')).toBeTrue();
  });

  it('only the editions with the Cashflow menu on the web keep the Customer Checks topic under Cashflow', () => {
    open('NA');
    const has = (key: string) => {
      const ed = component.editions.find(e => e.key === key)!;
      const cashflow = ed.tree.find(n => n.t === 'Detailed Guide')!.c!.find(n => n.t === 'Cashflow');
      return !!cashflow?.c?.some(n => n.t === 'Customer Checks');
    };
    expect(['enterprise', 'standard', 'express', 'pos'].map(has)).toEqual([true, true, true, true]);
    expect(['posbir', 'posbirbo'].map(has)).toEqual([false, false]);
  });

  it('opens a topic from a link inside a page', () => {
    open('ENTERPRISE');
    const ed = component.editions[0];
    const link = document.createElement('a');
    link.setAttribute('data-page', 'kitchen_queue.htm');
    const event = { target: link, preventDefault: () => {} } as unknown as Event;
    component.openFromContent(ed, event);
    expect(ed.selected?.t).toBe('Kitchen Queue');
  });
});
