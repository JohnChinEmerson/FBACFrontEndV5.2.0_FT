import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ItemTypesService } from 'src/app/services/Files/item-types.service';

// UPGRADE of a Set's component (Sales Transaction): pick the item it is swapped for and the upgrade price.
// The default price is the new item's price less the price of what it replaces; it can be lowered (or raised).
// The Set's own price never changes. data = [component line, Set line, items for sale]; closes with { ItemId, Price }.
@Component({
  selector: 'app-set-upgrade-ui',
  templateUrl: './set-upgrade-ui.component.html',
  styleUrls: ['./set-upgrade-ui.component.css']
})
export class SetUpgradeUIComponent implements OnInit {
  // (ngOnInit is async: the item types are fetched to leave the Sets out of the list)
  component : any;
  set       : any;
  items     : any[] = [];
  selected  : any = null;
  price     : number = 0;
  fromPrice : number = 0;   // the price of the component being replaced
  lockPrice : boolean = false;   // the cashier may not edit prices (Sales access right EditPrice = no): the default stays

  constructor(
    private dialogRef : MatDialogRef<SetUpgradeUIComponent>,
    private itemTypesService : ItemTypesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  async ngOnInit(){
    this.component = this.data[0];
    this.set       = this.data[1];
    this.lockPrice = !!this.data[3];
    var all: any[] = this.data[2] || [];
    this.fromPrice = +(all.find(x => x.ItemId == this.component.ItemId)?.Price ?? 0);
    // a Set cannot be an upgrade (the server refuses it too): its item types are the ones flagged IsSet
    var setTypes: string[] = [];
    try {
      var types: any[] = await firstValueFrom(this.itemTypesService.getItemTypes());
      setTypes = (types || []).filter(t => (t.IsSet || '').toString().toLowerCase() == 'yes').map(t => (t.ItemType || '').toString().toLowerCase());
    } catch { }
    // the item itself is not an upgrade of itself
    this.items = all.filter(x => x.ItemId != this.component.ItemId && !setTypes.includes((x.ItemType || '').toString().toLowerCase()))
                    .sort((a, b) => (a.ItemName || '').localeCompare(b.ItemName || ''));
  }

  onSelect(item: any){
    this.price = item ? Math.max(0, Math.round((+item.Price - this.fromPrice) * 100) / 100) : 0;
  }

  get valid(): boolean {
    return !!this.selected && this.price !== null && +this.price >= 0;
  }

  onConfirm(){
    if (!this.valid) return;
    this.dialogRef.close({ 'ItemId': this.selected.ItemId, 'Price': Math.round(+this.price * 100) / 100 });
  }

  onClose(){
    this.dialogRef.close();
  }
}
