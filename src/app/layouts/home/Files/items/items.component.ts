import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ItemsService } from 'src/app/services/Files/items.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import { ItemUIComponent } from '../item-ui/item-ui.component';
import { ItemPriceCategorysUIComponent } from '../item-price-categorys-ui/item-price-categorys-ui.component';
import { BarcodeItemsUIComponent } from '../barcode-items-ui/barcode-items-ui.component';
import { ItemExpiryDatesUIComponent } from '../../Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { UploadItemsUIComponentComponent } from '../upload-items-uicomponent/upload-items-uicomponent.component';
import { ItemPhotoUIComponent } from '../item-photo-ui/item-photo-ui.component';
import { ReceivingAveCostHistoryUIComponent } from '../../Receiving/receiving-ave-cost-history-ui/receiving-ave-cost-history-ui.component';
import { MultipleUMsComponent } from '../multiple-ums/multiple-ums.component';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import * as XLSX from 'xlsx';
import { SerialNosUIComponent } from '../serial-nos-ui/serial-nos-ui.component';
import { BranchUpdateUIComponent } from '../branch-update-ui/branch-update-ui.component';
import { CommonService } from 'src/app/services/common.service';
import { ItemTypesService } from 'src/app/services/Files/item-types.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items           : any[] = [];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  photoUrl        : string = _url+"img/items/";
  repackSources   : any =['All', 'Yes', 'No'];
  repackSource   : string ='All';
  itemTypes      : any[] = [{ 'ItemType': 'All' }];
  itemType       : string = 'All';
  isColorOutOfStock : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons = [
  { Label: 'View', Function: () => this.onClickView(), Disabled: true },
  { Label: 'New', Function: () => this.onClickNew(), Disabled: true },
  { Label: 'Print', Function: () => this.onClickPrint(), Disabled: true },
  { Label: 'Barcoding', Function: () => this.onClickBarcoding(), Disabled: true },
  { Label: 'Upload Items', Function: () => this.onClickUploadItems(), Disabled: true },
  { Label: 'Export Items', Function: () => this.onClickExportItems(), Disabled: true },

  ...(this.authService.Branch?.BranchId === 'b01'
    ? [{
        Label: 'Branch Update',
        Function: () => this.onClickBranchUpdate(),
        Disabled: true
      }]
    : [])
  ];

  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
    {'Label'   : 'Multiple UMs','Function'  : () => this.onClickMultipleUMs(),'Disabled': true,}, 
    {'Label'   : 'Price Categories','Function'  : () => this.onClickOtherPriceCategories(),'Disabled': true,}, 
    {'Label'   : 'Expiry Dates','Function'  : () => this.onClickExpiryDates(),'Disabled': true,}, 
    {'Label'   : 'Serial Nos','Function'  : () => this.onClickSerialNos(),'Disabled': true,}, 
    {'Label'   : 'AveCost History','Function'  : () => this.onClickAveCostHistory(),'Disabled': true,}, 
    {'Label'   : 'Photo','Function'          : () => this.onClickPhoto(),'Disabled': true,}, 
  ];

  defaultColumns  = ['ItemId','ItemName','UM','Category', 'ItemType','Cost','AveCost','Price','Available','AlertQty','HasInventory', 'Consumable', 'Barcode'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost','AveCost','Price','Available','AlertQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private itemsService        : ItemsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private globalConfigService         : GlobalConfigService,
    public authService          : AuthService,
    public commonService         :CommonService,
    private itemTypesService    : ItemTypesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.loadItemTypes();
    await this.homeTs.getButtons();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async onClickView(){
    this.isLoading = true;
    this.items = await firstValueFrom(this.itemsService.getItemsToDisplay());
    if(this.items)
      this.isLoading = false;
    this.displayRecords();
  }

  // Desktop ItemsUI.LoadItemType: "All" plus every item type
  async loadItemTypes(){
    const itemTypes: any = await firstValueFrom(this.itemTypesService.getItemTypes());
    this.itemTypes = [{ 'ItemType': 'All' }, ...itemTypes];
  }

  displayRecords(){
    var data = this.items || [];
    // Desktop ItemsUI.cboItemType_SelectedIndexChanged: only the items of the chosen type ("Ad-on" = "Add-on")
    if(this.itemType.toLowerCase() != 'all'){
      const norm = (t: string) => (t ?? '').trim().toLowerCase().replace(/^add-on$/, 'ad-on');
      data = data.filter(x => norm(x.ItemType) == norm(this.itemType));
    }
    // if(this.repackSource.toLowerCase() != 'all'){
    //     data = data.filter(x => x.HasRepackSource.toLowerCase() == this.repackSource.toLowerCase());
    // }
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    if(this.searchKey) this.applyFilter();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.ItemId;
    this.selectedData = data;
  }

  onClickNew(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', 'items', this.items]);
    this.dialog.open(ItemUIComponent,dialogConfig).beforeClosed().subscribe(items => {
      if(items){
        this.items = items;
        this.displayRecords();
      }
    });
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var item:any = await firstValueFrom(this.itemsService.getItemByItemId(this.selectedData.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([item, 'items']);
    this.dialog.open(ItemUIComponent, dialogConfig).beforeClosed().subscribe(item => {
      if (item) {
        this.items = this.items.map(detail =>
          detail.ItemId === item.ItemId ? item : detail
        );
        this.displayRecords();
      }
    });
    
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record","Are you sure to delete this item?").then((result) => {
      if (result.value) {
        this.itemsService.deleteItem(this.selectedData.ItemId).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.items = this.items.filter(x => x.ItemId != this.selectedData.ItemId);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickMultipleUMs(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = ([this.selectedData, 'items']);
    this.dialog.open(MultipleUMsComponent,dialogConfig);
  }

  onClickBarcoding(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    this.dialog.open(BarcodeItemsUIComponent,dialogConfig);
  }

  onClickOtherPriceCategories(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.selectedData, 'items', this.selectedData.UM]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig);
  }


  onClickExpiryDates(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = [this.selectedData, 'items'];
    this.dialog.open(ItemExpiryDatesUIComponent,dialogConfig);
  }
  
  onClickSerialNos(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = ([this.selectedData, 'items']);
    this.dialog.open(SerialNosUIComponent,dialogConfig);
  }

  onClickAveCostHistory(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data        = this.selectedData;
    this.dialog.open(ReceivingAveCostHistoryUIComponent,dialogConfig);
  }

  onClickUploadItems(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '760px';
    this.dialog.open(UploadItemsUIComponentComponent,dialogConfig).beforeClosed().subscribe(x=>{
      this.onClickView();
    })
  }

  onClickExportItems(){
    var exportItems = this.listData?.filteredData
    if (exportItems.length > 0) {
      const columnsToExport = ['ItemName','UM','Category','Cost','Price','Available','Barcode'];

      const filteredExcel = exportItems.map(row =>
        columnsToExport.reduce((acc, column) => {
          acc[column] = row[column];
          return acc;
        }, {})
      );
    
      if (filteredExcel.length === 0) {
        return this.notificationService.toastrWarning('No records found.');
      }
    
      const workSheet = XLSX.utils.json_to_sheet(filteredExcel);
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
      var filename = 'items.xlsx';

      XLSX.writeFile(
        workBook,
        filename
      );
    } else {
      return this.notificationService.toastrWarning('No records found.');
    }
  }

  async onClickPhoto(){
    var item:any = await firstValueFrom(this.itemsService.getItemByItemId(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.width        = '500px';
    dialogConfig.data         = item;
    this.dialog.open(ItemPhotoUIComponent,dialogConfig);
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printitems']));
    var data  = this.listData.filteredData;
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Title', 'ITEMS');
  }

  onClickBranchUpdate(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = true;
    this.dialog.open(BranchUpdateUIComponent,dialogConfig);
  }
  
  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
