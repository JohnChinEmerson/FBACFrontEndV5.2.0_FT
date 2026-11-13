import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StockAdjustmentTransactionService } from 'src/app/services/StockAdjustments/stock-adjustment-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { StockAdjustmentDetailUIComponent } from '../stock-adjustment-detail-ui/stock-adjustment-detail-ui.component';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-load-items-for-stock-adjustment-ui',
  templateUrl: './load-items-for-stock-adjustment-ui.component.html',
  styleUrls: ['./load-items-for-stock-adjustment-ui.component.css']
})
export class LoadItemsForStockAdjustmentUIComponent implements OnInit {
  stocks           : any=[];
   selectedData    : any;
   selectedId      : number = 0;
   searchKey       : string = "";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   selectedItem : any;
   type :string;
   isColorOutOfStock : boolean = true;
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
 
   toolButtons     = [
     {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Save To StockAdjustment','Function'   : () => this.onClickSaveToStockAdjustment(),'Disabled': true,}, 
   ];  
   contextButtons     = [];
   defaultColumns  = ['ItemName','UM','Category','Price','Available'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price','Available'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

   transCode: string;
   reasonId: string;
   stockAdjustmentDetails: any=[];
   stockAdjustmentHeader: any;
   stock: any;
   ui: any;
   dateFrom: string;
   dateTo: string;
   adjustmentType : string;
   constructor(
     private dialog                      : MatDialog,
     private dialogRef                   : MatDialogRef<LoadItemsForStockAdjustmentUIComponent>,
     private stocksService        : StocksService,
     private notificationService : NotificationService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService      : DateTimesService,
     public matTableService     : MatTableService,
     private stockAdjustmentTransactionService : StockAdjustmentTransactionService,
     private stockAdjustmentHeadersService : StockAdjustmentHeadersService,
     private globalConfigService         : GlobalConfigService,
     @Inject(MAT_DIALOG_DATA) public data: any, 
   ) { }
 
   async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.isColorOutOfStock = await this.globalConfigService.isColorOutOfStock();
     this.transCode = this.data[0];
     this.reasonId    = this.data[1];
     this.stockAdjustmentDetails = this.data[2];
     this.stockAdjustmentHeader = this.data[2];
     this.ui = this.data[3];
     this.type = this.data[4];
     this.adjustmentType = this.data[5];
     this.onClickView();
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
     if(this.type.toLocaleLowerCase() == 'stocks')
       this.stocks = await firstValueFrom(this.stocksService.getStocks());
   
     if(this.stocks)
       this.isLoading = false;
     this.displayRecords();
   }
 
 
   displayRecords(){
     var data = this.stocks;
     this.listData =  new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;
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
 
   onClose(){
     if(this.ui == 'stockadjustmenttransaction'){
       this.dialogRef.close(this.stockAdjustmentDetails);
     }
     if(this.ui == 'stockadjustmentreceipts'){
       this.dialogRef.close(this.stockAdjustmentHeader);
     }
   }
 
   applyFilter2(){
     this.matTableService.applyFilter(this.listData, this.searchKey);
     this.selectedId = this.listData.filteredData[0].ItemId;
     this.onClickSaveToStockAdjustment();
   }
 
   onClickSaveToStockAdjustment(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
 
     this.selectedItem  = this.stocks.filter(x => x.ItemId == this.selectedId);
     this.selectedItem = this.selectedItem[0];
 
     if(this.ui == 'stockadjustmentreceipts')
       this.PopupQtyUI2();
     else{
       this.stockAdjustmentTransactionService.saveToStockAdjustmentHeaders(this.adjustmentType, this.selectedId, 1, this.transCode, this.reasonId, this.selectedItem.Cost,this.selectedItem.UM,  'open').subscribe({
         next: (res)=>{
          this.transCode = res.stockAdjustmentDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
           this.notificationService.toastrSuccess(res.message);
           this.stockAdjustmentDetails = [ res.stockAdjustmentDetail,...this.stockAdjustmentDetails]; 
           this.selectedId = undefined;
         },
         error: (err)=>{
           this.notificationService.toastrError(err.error.message);
         }
       }); 
     }
   }
 
   async PopupQtyUI2()
   {
     var stock:any     = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedId));
     stock.TransCode   = this.transCode;
     stock.ReasonId  = this.reasonId;
     
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '600px';
     if(this.ui == 'stockadjustmenttransaction'){
       dialogConfig.data = (['',stock, 'additemstockadjustmenttransaction']);
     }
     if(this.ui == 'stockadjustmentreceipts'){
       stock.TransNo   = this.stockAdjustmentHeader.TransNo;
       dialogConfig.data = (['',stock, 'additemstockadjustmentreceipts', this.adjustmentType]);
     }
     this.dialog.open(StockAdjustmentDetailUIComponent,dialogConfig).beforeClosed().subscribe(async stockAdjustmentDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(stockAdjustmentDetail) ? stockAdjustmentDetail[0] : stockAdjustmentDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
       if(this.ui == 'stockadjustmenttransaction'){
         this.stockAdjustmentDetails = [ stockAdjustmentDetail,...this.stockAdjustmentDetails]; 
         this.selectedId = undefined;
       }
       if(this.ui == 'stockadjustmentreceipts'){
         this.stockAdjustmentHeader = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeaderByTransNo(stockAdjustmentDetail.TransNo));
       }
     });
    
   }

}
