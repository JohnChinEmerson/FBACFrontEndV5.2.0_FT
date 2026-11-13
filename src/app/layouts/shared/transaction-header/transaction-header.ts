import { MatDialogRef } from '@angular/material/dialog';

// Same breakpoint as Bootstrap md: below it the header dialogs use the phone layout (transaction-header.css)
export const HEADER_PHONE_QUERY = '(max-width: 767.98px)';

// Phones: the transaction header dialog takes the whole screen (the sh-phone rules in transaction-header.css)
export function fitHeaderDialogToPhone(dialogRef: MatDialogRef<any>): void {
  if (window.matchMedia(HEADER_PHONE_QUERY).matches) {
    dialogRef.addPanelClass('sh-phone');
    dialogRef.updateSize('100vw', '100%');
  }
}
