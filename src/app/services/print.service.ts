import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserActivitiesService } from './User/user-activities.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(
    private auth                   : AuthService,
    private userActivitiesService  : UserActivitiesService,
  ) { }

  popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
    const titleBefore = this.storedTitle();
    const popup = win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
    this.logPrint(url, titleBefore);
    return popup;
  }

  private storedTitle(): string {
    try { return localStorage.getItem('Title') ?? ''; } catch { return ''; }
  }

  // Every print / reprint goes through popupWindow, so it is logged here (User Activities). The caller sets the
  // title of the print right after opening the window, hence the deferred read; a title that did not change
  // since the window was opened is left out - it may belong to an earlier print.
  private logPrint(url: string, titleBefore: string) {
    setTimeout(() => {
      try {
        if (!this.auth.LoginId)
          return;
        const name  = String(url ?? '').split('?')[0].split('/').filter(x => x).pop() ?? 'print';
        const title = this.storedTitle();
        const subject = 'Printed ' + name.replace(/^print/i, '') + (title && title != titleBefore ? ' - ' + title : '');
        this.userActivitiesService.logActivity('PRINT', 'Print', subject).subscribe({ error: () => {} });
      } catch { }
    });
  }

  // POS receipt (print/printposbir or print/printpos): the data goes to localStorage before the popup reads it
  openPOSReceipt(url: string, win, storage: { [key: string]: any }) {
    Object.keys(storage).forEach(key => {
      var value = storage[key];
      localStorage.setItem(key, typeof value == 'string' ? value : JSON.stringify(value));
    });
    return this.popupWindow(url, 'POSPrint', win, 1000, 700);
  }
}
