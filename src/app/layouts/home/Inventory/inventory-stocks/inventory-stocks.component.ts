import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { InventoryStocksService } from 'src/app/services/Inventory/inventory-stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MultipleUMsComponent } from '../../Files/multiple-ums/multiple-ums.component';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-inventory-stocks',
  templateUrl: './inventory-stocks.component.html',
  styleUrls: ['./inventory-stocks.component.css']
})
export class InventoryStocksComponent implements OnInit {
  stocksOngoing   : any[];
  stocksFinished  : any[];
  categorys       : any=[];
  categorys2       : any=[];
  category        : any = 'All';
  category2        : any = 'All';
  inventoryOptions : any =['All Stocks', 'Below Alert Qty', 'Qty Zero or Below', 'Has Sales Stocks', 'Selected Stocks'];
  finishinventoryOptions : any =['All Stocks', 'Valid Physical Count Only','Set All Physical Count To Zero'];
  selectedData    : any;
  selectedId      : number = 0;
  selectedData2    : any;
  selectedId1     : number = 0;
  searchKey       : string = "";
  searchKey2       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;
  dtFrom : any = new Date();
  dtTo : any = new Date();
  target  : any = 'All Stocks';
  itemPhysicalCounts : any=[];
  PhysicalCountReadOnly : boolean = false;
  isColorOutOfStock : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) contextMenu1: MatMenuTrigger;
  @ViewChild('physicalCountInput', { static: false }) physicalCountInput!: ElementRef;

  stocksToNewInventory  : any=[];
  contextMenuPosition = { x: '0px', y: '0px' };
  contextMenuPosition1 = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  toolButtons2     = [
    {'Label'   : 'View','Function'            : () => this.onClickView2(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint2(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Back To Ongoing','Function'            : () => this.onClickBackToOngoing(),'Disabled': true,}, 
  ];
  contextButtons1  =  [
    {'Label'   : 'Set All Physical Count To Zero','Function'  : () => this.onClickSetAllPhysicalCountToZero(),'Disabled': true,}, 
  ];
  defaultColumns  = ['ItemName','UM','Available','PhysicalCount'];
  defaultColumns2  = ['ItemName','UM','Variance','SystemCount','PhysicalCount'];
  addedColumns = ['actions'];

  btnAddToFinishText: string = 'Add To Finish';
  btnAddToFinishDisable: boolean = false;

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Available','PhysicalCount','Variance','SystemCount','PhysicalCount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  displayedColumns: string[] = [];


  constructor(
    private dialog              : MatDialog,
    private inventoryStocksService        : InventoryStocksService,
    private itemCategorysService : ItemCategorysService,
    private multipleUMsService : MultipleUMsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private stringHelperService              : StringHelperService,
    private notificationService : NotificationService,
    private numbersService : NumbersService,
    private globalConfigService         : GlobalConfigService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.displayedColumns = this.getDisplayedColumns();
    
    this.getItemCategorys();
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, this.toolButtons2, this.contextButtons1);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  setTarget(value: string) {
    this.target = value;
    this.displayedColumns = this.getDisplayedColumns();
  }

  async getItemCategorys(){
    this.categorys = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys.push(this.stringHelperService.allCategoryCBO());

    this.categorys2 = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys2.push(this.stringHelperService.allCategoryCBO());
  }
  async onClickView(){
    this.isLoading = true;
    this.stocksOngoing = await firstValueFrom(this.inventoryStocksService.getInventoryRecordByCategoryInventoryStatus(this.category, 'ongoing'));
    if(this.stocksOngoing)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickView2(){
    this.isLoading2 = true;
    this.stocksOngoing = await firstValueFrom(this.inventoryStocksService.getInventoryRecordByCategoryInventoryStatus(this.category2, 'close'));
    if(this.stocksOngoing)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.stocksOngoing;

    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  displayRecords2(){
    var data = this.stocksOngoing;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }


  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }
  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }
  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }
  clearSearch2(){
    this.searchKey2 =  this.matTableService.clearSearch(this.listData2);
  }
  getRecord1(data : any){
    this.selectedId1 = data.ItemId;
    this.selectedData2 = data;
  }
  getRecord(data : any){
    this.selectedId = data.ItemId;
    this.selectedData = data;
  }
  onClickNewInventory(target){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
   this.setTarget(target);
    if(target.toLowerCase() == 'selected stocks'){

      if( this.stocksToNewInventory.length > 0){
        this.AddToOngoingStocks(target);
      }else{
       this.notificationService.toastrWarning("Select Stock(s)");
      }
    }else{
      this.AddToOngoing(target, this.dtFrom, this.dtTo);
    }
  }

  AddToOngoing(target,  dtFrom,  dtTo)
  {
      var prefix = target.toUpperCase();
      if (target.toLowerCase() == "has sales stocks")
          prefix += " FROM " +  this.dateTimesService.ConvertToDateFormat(new Date(dtFrom)) + "-" + this.dateTimesService.ConvertToDateFormat(new Date(dtTo));
      var msg = prefix + " New Inventory Batch for " + this.category + " items will be EXECUTED. Continue?";

      this.notificationService.popupWarning("New Inventory",msg).then((result) => {
        if (result.value) {
          this.setNewInventory(target, dtFrom, dtTo);
        } 
      });
  }
  AddToOngoingStocks(target)
  {
    if( this.stocksToNewInventory.length == 0){
      return this.notificationService.toastrWarning("No Stock(s) Selected!");
    }

      var prefix = target.toUpperCase();
      var msg = prefix + " New Inventory Batch for " + this.category + " items will be EXECUTED. Continue?";

      this.notificationService.popupWarning("New Inventory",msg).then((result) => {
        if (result.value) {
          this.inventoryStocksService.setNewInventoryByStocks(this.stocksToNewInventory).subscribe({
            next:(res)=>{
              this.setTarget('All Stocks');
              this.onClickView();
              this.onClickView2();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
        } 
      });
  }
  setNewInventory(target, dtFrom, dtTo){
    this.inventoryStocksService.setNewInventoryByCategory(this.category2,target, this.dateTimesService.ConvertToDateFormat(new Date(dtFrom)) , this.dateTimesService.ConvertToDateFormat(new Date(dtTo))).subscribe({
      next:(res)=>{
        this.onClickView();
        this.onClickView2();
      },
      error:(err)=>{
        this.notificationService.toastrError(err.error);
      },
  });
  }

  onClickFinishInventory(target){
    if(this.listData?.filteredData.length == 0)
      return this.notificationService.toastrWarning('No Record Found.');

    if(target.toLowerCase() == 'set all physical count to zero'){
      this.onClickSetAllPhysicalCountToZero();
    }
    else{
      let filteredStocks = this.listData?.filteredData;

      this.setTarget(target);
      if(target.toLowerCase() == 'valid physical count only'){
        filteredStocks = this.listData?.filteredData?.filter(stock => stock.PhysicalCount != null && stock.PhysicalCount != "");
      }
  
      this.btnAddToFinishText = 'Processing...';
      this.btnAddToFinishDisable = true;
  
      this.inventoryStocksService.finishInventory(filteredStocks).subscribe({
        next: (res) => {
          this.onClickView();
          this.onClickView2();
          this.btnAddToFinishText = 'Add To Finish';
          this.btnAddToFinishDisable = false;
        },
        error: (err) => {
          this.notificationService.toastrError(err.error);
        },
      });
    }
    
  }

  onClickBackToOngoing(){
    this.inventoryStocksService.backToOngoingInventory(this.selectedId).subscribe({
        next:(res)=>{
          this.onClickView();
          this.onClickView2();
        },
        error:(err)=>{
          this.notificationService.toastrError(err.error);
        },
    });
  }


  onEnterPhysicalCount(itemId,  event,systemCount){
    const physicalCount = event.target.value;
    if(event.target.value){
      if (this.numbersService.isNotNumeric(physicalCount))
        {
            return this.notificationService.toastrWarning('Value is not numeric.')
        }else{
   

          this.inventoryStocksService.updateInventoryPhysicalCount(itemId, physicalCount, systemCount).subscribe({
              next:(res)=>{
                this.onClickView();
                this.onClickView2();
                
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
          });
        }
    }
  }

  onClickSetAllPhysicalCountToZero(){
    if(this.listData?.filteredData.length == 0)
      return this.notificationService.toastrWarning('No Record Found.');

  
    this.notificationService.popupWarning("Set To Zero","Set All PhysicalCount To Zero").then((result) => {
      if (result.value) {
          this.btnAddToFinishText = 'Processing...';
          this.btnAddToFinishDisable = true;

          this.inventoryStocksService.setAllPhysicalCountToZero(this.category).subscribe({
              next:(res)=>{
                this.onClickView();
                this.onClickView2();
                this.btnAddToFinishText = 'Add To Finish';
                this.btnAddToFinishDisable = false;
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
          });
      } 
    });

   
  }

  getDisplayedColumns(){
    if(this.target.toLowerCase() == 'selected stocks'){
      return this.addedColumns.concat(this.defaultColumns2);
    }else{
      return this.defaultColumns2;
    }
  }

  onCheckToNewInventory(data, value) {
    if (value) {
      this.stocksToNewInventory.push(data);
    } else {
      this.stocksToNewInventory = this.stocksToNewInventory.filter(
        (item) => item.ItemId !== data.ItemId
      );
    }
  
  }
    onCheckAllToNewInventory(value) {
    if (value) {
      this.listData2.filteredData.forEach(x => {
        this.stocksToNewInventory.push(x);
      });
    } else {
      this.stocksToNewInventory = [];
    }
  
  }

  existInCashReadingsToNewInventory(data){
    var exist:boolean = this.stocksToNewInventory.find(x => x.ItemId == data.ItemId);
    return exist;
  }
  
  

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printinventorystocks']));
    var data  = this.listData.filteredData;
    var title = ' ONGOING INVENTORY STOCKS';
    if(this.category.toLowerCase() != 'all'){
      title = ' ONGOING '+this.category.toUpperCase()+' INVENTORY STOCKS';
    }
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Status', 'ongoing');
    localStorage.setItem('Title', title);
  }

  onClickPrint2(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printinventorystocks']));
    var data  = this.listData2.filteredData;
    var title = ' CLOSE INVENTORY STOCKS';
    if(this.category.toLowerCase() != 'all'){
      title = ' CLOSE '+this.category.toUpperCase()+' INVENTORY STOCKS';
    }
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Items', JSON.stringify(data));
    localStorage.setItem('Status', 'close');
    localStorage.setItem('Title', title);
  }
  
  onContextMenu(event: MouseEvent, data: any, inventoryStatus) {
    if(inventoryStatus.toLowerCase() == 'ongoing'){
      if(this.contextButtons.length > 0){
        this.getRecord1(data);
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'data': data };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
      }
    }else{
      if(this.contextButtons.length > 0){
        this.getRecord(data);
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'data': data };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
      }
    }
  }

  async onCheckHasMultipleUMs(data){
    this.getRecord1(data);

    var mUMs:any = await firstValueFrom(this.multipleUMsService.getMultipleUMsByItemId(data.ItemId));
    var itemPhysicalCounts:any = this.itemPhysicalCounts.filter(x => x.ItemId == data.ItemId);
    if (mUMs.length > 0)
    {
        this.PhysicalCountReadOnly = true;

        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '1000px';
        dialogConfig.restoreFocus = false; 
        dialogConfig.data        = ([data, 'inventorystocks', mUMs,itemPhysicalCounts ]);
        this.dialog.open(MultipleUMsComponent,dialogConfig).beforeClosed().subscribe(x=>{
            if(x){
              this.physicalCountInput.nativeElement.blur();
              this.UpdateItemPhysicalCount(x.itemPhysicalCounts);
              if(x.totalQty != null){
                this.UpdateTotalQty(x.totalQty);
              }
            }
        });
    }
    else
    {
        this.PhysicalCountReadOnly = false;
    }
  }

    UpdateItemPhysicalCount(obj) {
      obj.forEach(x => {
        const existingItems = this.itemPhysicalCounts.filter(i => i.ItemId === x.ItemId && i.UM === x.UM);

        if (existingItems.length > 0) {
          existingItems.forEach(i => {
            i.PhysicalCount = x.PhysicalCount;
          });
        } else {
          this.itemPhysicalCounts.push(x);
        }
      });
    }


  UpdateTotalQty(totalQty)
  {
    this.inventoryStocksService.updateInventoryPhysicalCount(this.selectedData2.ItemId, totalQty, this.selectedData2.SystemCount).subscribe({
          next:(res)=>{
            this.onClickView();
            this.onClickView2();
            
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error);
          },
      });
  }



}
