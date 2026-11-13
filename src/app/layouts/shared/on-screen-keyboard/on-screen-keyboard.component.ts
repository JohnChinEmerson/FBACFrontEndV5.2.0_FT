import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnScreenKeyboardService } from 'src/app/services/on-screen-keyboard.service';

// Desktop OnScreenKeyboard (LET / NUM tabs) for touch POS terminals; see OnScreenKeyboardService.
// Docked at the bottom above dialogs; while open the page and the dialogs make room for it so the
// field being typed in stays visible.
@Component({
  selector: 'app-on-screen-keyboard',
  templateUrl: './on-screen-keyboard.component.html',
  styleUrls: ['./on-screen-keyboard.component.css']
})
export class OnScreenKeyboardComponent implements OnInit, OnDestroy {
  readonly letterRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '@'],
  ];
  readonly numberKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.'];
  shift = true;
  private subscription: Subscription;

  constructor(
    public osk: OnScreenKeyboardService,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) { }

  // the document listeners run outside Angular's zone: a click anywhere in the app must not start a change
  // detection (it re-rendered lists between mousedown and mouseup, so their buttons never got the click);
  // the zone is entered only when the keyboard opens or closes
  private listeners: [string, any, boolean][] = [];

  ngOnInit(): void {
    this.subscription = this.osk.changes.subscribe(() => {
      this.cdr.detectChanges();
      this.makeRoom();
    });
    this.zone.runOutsideAngular(() => {
      this.listen('pointerdown', () => this.lastPointerDown = Date.now(), true);
      this.listen('focusin', (e: FocusEvent) => this.onFocusIn(e), true);
      this.listen('pointerup', (e: PointerEvent) => this.onPointerUp(e), true);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.listeners.forEach(([type, handler, capture]) => document.removeEventListener(type, handler, capture));
    this.osk.close();
  }

  private listen(type: string, handler: any, capture: boolean){
    document.addEventListener(type, handler, capture);
    this.listeners.push([type, handler, capture]);
  }

  // follows the field the user taps / clicks while a sales screen has it turned on. Focus moved by code
  // (the sales screen focuses its search box after every item) does not open it: it would cover the screen.
  private lastPointerDown = 0;

  private onFocusIn(event: FocusEvent){
    if (!this.osk.enabled) return;
    var el: any = event.target;
    if (this.host.nativeElement.contains(el)) return;
    var byUser = Date.now() - this.lastPointerDown < 800;
    if (this.osk.isTypingField(el) && (byUser || this.osk.visible)) this.zone.run(() => this.osk.open(el));
    else if (this.osk.visible && !this.osk.isTypingField(el)) this.zone.run(() => this.osk.close());
  }

  @HostListener('document:keydown.escape')
  onEscape(){
    if (this.osk.visible) this.osk.close();
  }

  // a tap on an already focused field brings the keyboard back after CLOSE
  private onPointerUp(event: PointerEvent){
    if (!this.osk.enabled || this.osk.visible) return;
    var el: any = event.target;
    if (el === document.activeElement && this.osk.isTypingField(el)) this.zone.run(() => this.osk.open(el));
  }

  // keys must not take the focus (and the caret) away from the field
  keepFocus(event: Event){
    event.preventDefault();
  }

  type(key: string){
    var k = key.length == 1 && /[A-Z]/.test(key) && !this.shift ? key.toLowerCase() : key;
    this.osk.press(k);
  }

  // dialogs and the page move up so the keyboard never covers the field being typed in
  private makeRoom(){
    var body = document.body;
    if (!this.osk.visible) {
      body.classList.remove('osk-open');
      body.style.removeProperty('--osk-height');
      return;
    }
    // after the keyboard is drawn
    this.zone.runOutsideAngular(() => setTimeout(() => {
      var panel = this.host.nativeElement.querySelector('.osk') as HTMLElement;
      if (!panel) return;
      body.style.setProperty('--osk-height', panel.offsetHeight + 'px');
      body.classList.add('osk-open');
      var target = this.osk.target as HTMLElement;
      if (target) {
        var rect = target.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - panel.offsetHeight - 8 || rect.top < 0)
          target.scrollIntoView({ block: 'center' });
      }
    }));
  }
}
