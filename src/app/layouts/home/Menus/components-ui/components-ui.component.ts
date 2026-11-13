import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MenuCostingService } from 'src/app/services/Menus/menu-costing.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UMConvertionUIComponent } from '../um-convertion-ui/um-convertion-ui.component';

// Desktop Mariosoft.Costing.UI ComponentsUI (+ UMConvertionUI): recipe of a menu item.
// QtyPerPC = QtyUsed / QtyMade, TotalCost = QtyPerPC x Cost, product cost = sum of TotalCost (computed by the API).
@Component({
  selector: 'app-components-ui',
  templateUrl: './components-ui.component.html',
  styleUrls: ['../menus-shared.css', './components-ui.component.css']
})
export class ComponentsUIComponent implements OnInit {
  product         : any;
  components      : any[] = [];
  totalCost       : number = 0;
  qtyMade         : number = 1;
  itemTypes       : string[] = ['All'];
  itemType        : string = 'All';
  items           : any[] = [];
  searchKey       : string = '';
  checkedIds      : Set<string> = new Set<string>();
  selectedComponent : any = null;
  isLoading       : boolean = false;

  constructor(
    private dialog              : MatDialog,
    private menuCostingService  : MenuCostingService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<ComponentsUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  async ngOnInit(): Promise<void> {
    this.product = this.data[0];
    var itemTypes: any = await firstValueFrom(this.menuCostingService.getItemTypesForComponents());
    this.itemTypes = ['All', ...itemTypes];
    await this.loadComponents();
    await this.loadItems();
  }

  applyComponents(res: any){
    this.product    = res.product || this.product;
    this.components = res.components || [];
    this.totalCost  = +res.totalCost || 0;
    this.qtyMade    = +(this.product?.QtyMade || 1);
  }

  async loadComponents(){
    var res = await firstValueFrom(this.menuCostingService.getItemComponentsByProductId(this.product.ItemId));
    this.applyComponents(res);
  }

  async loadItems(){
    this.isLoading = true;
    try {
      this.items = await firstValueFrom(this.menuCostingService.getItemsForComponents(this.product.ItemId, this.itemType));
    } finally {
      this.isLoading = false;
    }
    this.checkedIds.clear();
  }

  get filteredItems(){
    var key = (this.searchKey || '').toLowerCase();
    if (!key) return this.items;
    return this.items.filter(x => (x.ItemName || '').toLowerCase().includes(key));
  }

  toggleItem(itemId: string){
    this.checkedIds.has(itemId) ? this.checkedIds.delete(itemId) : this.checkedIds.add(itemId);
  }

  private handle(obs: any, reloadItems: boolean = false){
    obs.subscribe({
      next:(res) => {
        this.applyComponents(res);
        if (reloadItems) this.loadItems();
      },
      error:(err) => {
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  // Desktop: double-click an item (or Add the checked ones) to make it a component
  addItems(itemIds: string[]){
    if (itemIds.length == 0) return this.notificationService.toastrWarning('No item checked.');
    this.handle(this.menuCostingService.addItemComponents(this.product.ItemId, itemIds), true);
  }

  addChecked(){
    this.addItems(Array.from(this.checkedIds));
  }

  onEnterQtyMade(){
    var qty = +this.qtyMade;
    if (!qty || qty <= 0) return this.notificationService.toastrWarning('QtyMade should be greater than 0.');
    this.handle(this.menuCostingService.updateQtyMade(this.product.ItemId, qty));
  }

  updateQtyUsed(event: any, component: any){
    var qty = parseFloat(String(event.target.value).replace(/,/g, ''));
    if (isNaN(qty) || qty < 0) return this.notificationService.toastrWarning('Invalid QtyUsed.');
    this.handle(this.menuCostingService.updateComponentQtyUsed(component.id, qty));
  }

  // Desktop dtg2_CellDoubleClick (UM column): UMConvertionUI, then the components and total cost are reloaded
  onDoubleClickUM(component: any){
    this.selectedComponent = component;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = false;
    dialogConfig.width        = '800px';
    dialogConfig.maxWidth     = '98vw';
    dialogConfig.data         = ([component]);
    this.dialog.open(UMConvertionUIComponent, dialogConfig).beforeClosed().subscribe(async res => {
      if (res && res.components) this.applyComponents(res);
      else if (res) await this.loadComponents();
    });
  }

  toggleReturnable(){
    if (!this.selectedComponent) return this.notificationService.toastrWarning('No Record Selected.');
    var c = this.selectedComponent;
    var action = c.Returnable?.toLowerCase() == 'yes' ? 'UnReturnable' : 'Returnable';
    this.notificationService.popupWarning('Returnable', c.ComponentName + ' will be set to ' + action + '. Continue?').then((result) => {
      if (result.value) this.handle(this.menuCostingService.toggleComponentReturnable(c.id));
    });
  }

  onClickRemove(){
    if (!this.selectedComponent) return this.notificationService.toastrWarning('No Record Selected.');
    var c = this.selectedComponent;
    this.notificationService.popupWarning('Remove', c.ComponentName + ' will be removed. Continue?').then((result) => {
      if (result.value) {
        this.selectedComponent = null;
        this.handle(this.menuCostingService.deleteItemComponent(c.id), true);
      }
    });
  }

  onClickRemoveAll(){
    if (this.components.length == 0) return;
    this.notificationService.popupWarning('Remove All', 'All components will be removed. Continue?').then((result) => {
      if (result.value) {
        this.selectedComponent = null;
        this.handle(this.menuCostingService.deleteItemComponentsByProductId(this.product.ItemId), true);
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}
