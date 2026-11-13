import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTouchContextMenu]'
})
export class TouchContextMenuDirective {

   @Input() pressDelay = 700; // long press delay (ms)

  private timer: any;
  // the long press opened the menu: the finger lifting must not count as a tap (it would close the menu at once)
  private fired = false;

  constructor(private el: ElementRef) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {

    this.fired = false;
    this.clearTimer();
    this.timer = setTimeout(() => {

      const touch = event.touches[0];

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY
      });

      this.fired = true;
      // on the touched element (a row), so its own right-click handler gets the row like a mouse right-click
      (event.target as HTMLElement || this.el.nativeElement).dispatchEvent(contextMenuEvent);

    }, this.pressDelay);

  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.clearTimer();
    if (this.fired) {
      this.fired = false;
      if (event.cancelable) event.preventDefault();   // no click after the long press
    }
  }

  @HostListener('touchmove')
  onTouchMove() {
    this.clearTimer();
  }

  // the browser's own long-press menu event: the directive already opened the app's menu
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    if (this.fired && event.isTrusted) event.preventDefault();
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

}
