import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type OskMode = 'letters' | 'numbers';

// Desktop OnScreenKeyboard (Sales Config OnScreenKeyboard = yes): one keyboard for the whole app, shown by
// <app-on-screen-keyboard> in the home shell. The sales screens turn it on while they are open; it then
// follows the focused text / number field, also inside dialogs. Keys are typed through real input events,
// so ngModel, form controls and input masks see them like typed keys.
@Injectable({
  providedIn: 'root'
})
export class OnScreenKeyboardService {
  enabled : boolean = false;
  visible : boolean = false;
  mode    : OskMode = 'letters';
  target  : HTMLInputElement | HTMLTextAreaElement | null = null;
  readonly changes = new Subject<void>();
  private savedInputMode: string | null = null;
  private owners = new Set<any>();

  // a screen turns the keyboard on for as long as it is open (several screens may share it)
  setEnabled(owner: any, enabled: boolean){
    if (enabled) this.owners.add(owner); else this.owners.delete(owner);
    this.enabled = this.owners.size > 0;
    if (!this.enabled) this.close();
  }

  isTypingField(el: any): boolean {
    if (!el || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return false;
    if (el.disabled || el.readOnly || el.closest('[data-no-osk]')) return false;
    if (el instanceof HTMLTextAreaElement) return true;
    return ['text', 'search', 'number', 'tel', 'email', 'password', ''].includes((el.type || '').toLowerCase());
  }

  open(el: HTMLInputElement | HTMLTextAreaElement, mode?: OskMode){
    if (!this.enabled || !this.isTypingField(el)) return;
    if (this.target !== el) {
      this.restoreInputMode();
      this.target = el;
      // no phone / tablet keyboard on top of this one
      this.savedInputMode = el.getAttribute('inputmode');
      el.setAttribute('inputmode', 'none');
    }
    this.mode = mode || this.guessMode(el);
    this.visible = true;
    this.changes.next();
  }

  close(){
    this.restoreInputMode();
    this.target = null;
    this.visible = false;
    this.changes.next();
  }

  setMode(mode: OskMode){
    this.mode = mode;
    this.changes.next();
  }

  // amounts / quantities open on the number pad, everything else on the letters
  private guessMode(el: HTMLInputElement | HTMLTextAreaElement): OskMode {
    var inputMode = (this.savedInputMode || '').toLowerCase();
    var type = (el as HTMLInputElement).type?.toLowerCase();
    if (type == 'number' || type == 'tel' || inputMode == 'decimal' || inputMode == 'numeric' || el.hasAttribute('mask'))
      return 'numbers';
    return 'letters';
  }

  private restoreInputMode(){
    if (!this.target) return;
    if (this.savedInputMode === null) this.target.removeAttribute('inputmode');
    else this.target.setAttribute('inputmode', this.savedInputMode);
    this.savedInputMode = null;
  }

  press(key: string){
    var el = this.target;
    if (!el || !el.isConnected) return this.close();
    if (key == 'enter') return this.sendEnter(el);
    var value = el.value || '';
    // number inputs have no caret position: they are typed at the end
    var hasCaret = el.selectionStart !== null && el.selectionStart !== undefined && (el as HTMLInputElement).type != 'number';
    var start = hasCaret ? el.selectionStart : value.length;
    var end = hasCaret ? el.selectionEnd : value.length;
    if (key == 'back') {
      if (start == end && start > 0) start--;
      value = value.slice(0, start) + value.slice(end);
      end = start;
    } else if (key == 'clear') {
      value = ''; start = end = 0;
    } else {
      if (key == '.' && value.includes('.') && this.mode == 'numbers') return;
      value = value.slice(0, start) + key + value.slice(end);
      start = end = start + key.length;
    }
    el.value = value;
    if (hasCaret) {
      try { el.setSelectionRange(start, end); } catch (e) { }
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    // keyup handlers (search filters, live totals) run as for a typed key
    el.dispatchEvent(new KeyboardEvent('keyup', { key: key.length == 1 ? key : 'Unidentified', bubbles: true }));
  }

  private sendEnter(el: HTMLElement){
    ['keydown', 'keypress', 'keyup'].forEach(type =>
      el.dispatchEvent(new KeyboardEvent(type, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true } as any)));
  }
}
