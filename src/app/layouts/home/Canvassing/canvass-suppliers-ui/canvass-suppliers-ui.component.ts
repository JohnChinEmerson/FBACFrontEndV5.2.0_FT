import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailSuppliersService } from 'src/app/services/Canvassing/canvass-detail-suppliers.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { StockSupplierUIComponent } from '../stock-supplier-ui/stock-supplier-ui.component';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { CanvassTransactionService } from 'src/app/services/Canvassing/canvass-transaction.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-canvass-suppliers-ui',
  templateUrl: './canvass-suppliers-ui.component.html',
  styleUrls: ['./canvass-suppliers-ui.component.css']
})
export class CanvassSuppliersUIComponent implements OnInit {
  canvassDetail : any=[];
  action : string;
  lblItemName : string;
  itemSuppliers : any=[];
  listData        : MatTableDataSource<any>;
  searchKey       : string;
  isLoading       : boolean = false;
  selectedId      : string;
  selectedData    : any;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'New Supplier','Function'  : () => this.onClickNewSupplier(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Add','Function' : () => this.onClickAdd(),'Disabled': true,}, 
  ];
  defaultColumns    = ['SupplierName', 'ContactNo','Cost', 'TermDays', 'DiscountPercent', 'MinimumQty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost', 'TermDays', 'DiscountPercent', 'MinimumQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private stockSuppliersService : StockSuppliersService, 
    private canvassDetailSuppliersService : CanvassDetailSuppliersService, 
    private canvassTransactionService : CanvassTransactionService, 
    private stocksService : StocksService,
    private dialogRef : MatDialogRef<CanvassSuppliersUIComponent>,
    private dialog : MatDialog,
    public matTableService     : MatTableService,
    private notificationService     : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
    this.canvassDetail = this.data[0];
    this.action = this.data[1];
    this.lblItemName = this.canvassDetail.ItemName.toUpperCase();
    this.displaySuppliers();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async displaySuppliers(){
    this.itemSuppliers = [];
    this.isLoading = true;
    var temp: any[] = await firstValueFrom(this.stockSuppliersService.getStockSuppliersByItemId(this.canvassDetail.ItemId));
    var suppliers: any[] = await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSuppliersByTransDetailId(this.canvassDetail.id));

    temp.forEach((supplier) => {
      let result = suppliers.filter((data) => data.SupplierName === supplier.SupplierName);
      
      if (result.length === 0) {
        this.itemSuppliers.push(supplier);
      }
    });
    this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.itemSuppliers;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  async onClickNewSupplier(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.canvassDetail.ItemId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([stock,this.canvassDetail, 'savestocksupplier','']);  
    this.dialog.open(StockSupplierUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.displaySuppliers();
      }
    });
  }

  async onClickAdd(){
    var object:any = {
      data : this.selectedData, 
      canvassDetail : this.canvassDetail,
    };

    if(this.action == 'addcanvasssuppliers'){
      this.canvassTransactionService.addSupplierFromCanvassTransaction(object).subscribe({
        next : (res) =>{
          this.notificationService.toastrSuccess(res.message);
          this.displaySuppliers();
        },
        error : (err) =>{
          this.notificationService.toastrError(err.error.message);
        },  
      });
    }

    if(this.itemSuppliers.count == 0){
      this.dialogRef.close();
    }
  }
    
  onContextMenu(event: MouseEvent, data: any) {
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

  onClose(){
    this.dialogRef.close();
  }
}
