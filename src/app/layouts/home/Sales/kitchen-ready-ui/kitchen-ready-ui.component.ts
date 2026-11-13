import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { KitchenQueueService } from 'src/app/services/Sales/kitchen-queue.service';
import { KitchenOrderCardsComponent } from '../../../shared/kitchen-order-cards/kitchen-order-cards.component';

// Sales Transaction > READY TO SERVE: the tables with items ready to serve (items and waiting time); View details
// opens that table's Kitchen Queue READY TO SERVE card (Served per item, Serve All) over the order screen.
// The Sales screen keeps it up to date (setLines) while it is open; saving refreshes the Sales screen and the
// Kitchen Queue through KitchenQueueService.requiredRefresh.
// data: [readyLines]
@Component({
  selector: 'app-kitchen-ready-ui',
  templateUrl: './kitchen-ready-ui.component.html',
  styleUrls: ['./kitchen-ready-ui.component.css']
})
export class KitchenReadyUIComponent implements OnInit {
  cards       : any[] = [];
  selectedKey : string | null = null;   // the table whose details are shown (null: the table list)
  isSaving    : boolean = false;
  now         : number = Date.now();

  constructor(
    private dialogRef : MatDialogRef<KitchenReadyUIComponent>,
    private kitchenQueueService : KitchenQueueService,
    private notificationService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.setLines(this.data[0] || []);
  }

  setLines(lines: any[]){
    this.now = Date.now();
    this.cards = KitchenOrderCardsComponent.group(lines, 'table');
    // its items were all served (here or in the Kitchen Queue): back to the tables
    if (this.selectedKey && !this.cards.some(c => c.Key == this.selectedKey)) this.selectedKey = null;
  }

  get selectedCard(){
    return this.cards.find(c => c.Key == this.selectedKey) || null;
  }

  get totalItems(): number {
    return this.cards.reduce((sum, c) => sum + c.ItemCount, 0);
  }

  // waiting since the first item of the table became ready
  minutesWaiting(card: any): number {
    var ready = card.Lines.map(l => l.ReadyDateTime).filter(d => !!d).sort()[0];
    return ready ? Math.max(0, Math.floor((this.now - new Date(ready).getTime()) / 60000)) : 0;
  }

  viewDetails(card: any){
    this.selectedKey = card.Key;
  }

  backToTables(){
    this.selectedKey = null;
  }

  // the Kitchen Queue checks the SERVED right of the user
  onStatus(event: { Ids: any[], Status: string }){
    if (event.Ids.length == 0 || this.isSaving) return;
    this.isSaving = true;
    this.kitchenQueueService.updateKitchenStatus(event.Ids, event.Status).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notificationService.toastrSuccess(res.message);
        // gone from the dialog at once; the next refresh brings the real list
        this.setLines([].concat(...this.cards.map(c => c.Lines)).filter(l => !event.Ids.includes(l.id)));
      },
      error: (err) => {
        this.isSaving = false;
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  trackByKey(index: number, card: any){
    return card.Key;
  }

  // the popup takes the keyboard: the Sales screen's F-key shortcuts must not run behind it
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent){
    if (/^F\d+$/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onClose(){
    this.dialogRef.close();
  }
}
