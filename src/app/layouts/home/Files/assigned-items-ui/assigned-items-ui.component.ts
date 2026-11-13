import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PrintersService } from 'src/app/services/Files/printers.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Files.UI AssignedItemsUI: which menu items print on this area's order slip.
@Component({
  selector: 'app-assigned-items-ui',
  templateUrl: './assigned-items-ui.component.html',
  styleUrls: ['./assigned-items-ui.component.css']
})
export class AssignedItemsUIComponent implements OnInit {
  printer           : any;
  categorys         : any[] = [];
  category          : string = 'All';
  unassignedItems   : any[] = [];
  assignedItems     : any[] = [];
  checkedIds        : Set<string> = new Set<string>();
  searchKey         : string = '';
  selectedAssigned  : any = null;
  isLoading         : boolean = false;

  constructor(
    private printersService       : PrintersService,
    private itemCategorysService  : ItemCategorysService,
    private notificationService   : NotificationService,
    private dialogRef             : MatDialogRef<AssignedItemsUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  async ngOnInit(): Promise<void> {
    this.printer = this.data[0];
    var categorys: any = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys = [{ 'Category': 'All' }, ...categorys];
    await this.refresh();
  }

  async refresh(){
    this.isLoading = true;
    try {
      this.assignedItems = await firstValueFrom(this.printersService.getPrinterItemsByPrinterId(this.printer.id));
      this.unassignedItems = await firstValueFrom(this.printersService.getUnassignedItemsByPrinterIdByCategory(this.printer.id, this.category));
    } finally {
      this.isLoading = false;
    }
    this.checkedIds.clear();
    this.selectedAssigned = null;
  }

  get filteredUnassigned(){
    var key = (this.searchKey || '').toLowerCase();
    if (!key) return this.unassignedItems;
    return this.unassignedItems.filter(x => (x.ItemName || '').toLowerCase().includes(key) || (x.Category || '').toLowerCase().includes(key));
  }

  get allChecked(){
    var rows = this.filteredUnassigned;
    return rows.length > 0 && rows.every(x => this.checkedIds.has(x.ItemId));
  }

  toggleItem(itemId: string){
    this.checkedIds.has(itemId) ? this.checkedIds.delete(itemId) : this.checkedIds.add(itemId);
  }

  toggleAll(){
    var rows = this.filteredUnassigned;
    if (this.allChecked) rows.forEach(x => this.checkedIds.delete(x.ItemId));
    else rows.forEach(x => this.checkedIds.add(x.ItemId));
  }

  onClickAssign(){
    if (this.checkedIds.size == 0) return this.notificationService.toastrWarning('No item checked.');
    this.printersService.assignPrinterItems({ 'PrinterId': this.printer.id, 'ItemIds': Array.from(this.checkedIds) }).subscribe({
      next:(res) => {
        this.notificationService.toastrSuccess(res.message);
        this.refresh();
      },
      error:(err) => {
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onClickRemove(){
    if (!this.selectedAssigned) return this.notificationService.toastrWarning('No Record Selected.');
    this.printersService.deletePrinterItem(this.selectedAssigned.id).subscribe({
      next:(res) => {
        this.notificationService.toastrSuccess(res.message);
        this.refresh();
      },
      error:(err) => {
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onClickRemoveAll(){
    if (this.assignedItems.length == 0) return;
    this.notificationService.popupWarning('Remove All', 'All items will be removed. Continue?').then((result) => {
      if (result.value) {
        this.printersService.deletePrinterItemsByPrinterId(this.printer.id).subscribe({
          next:(res) => {
            this.notificationService.toastrSuccess(res.message);
            this.refresh();
          },
          error:(err) => {
            this.notificationService.toastrError(err.error.message);
          }
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}
