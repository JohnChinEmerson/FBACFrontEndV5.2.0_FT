import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StockAdjustmentTransactionService } from 'src/app/services/StockAdjustments/stock-adjustment-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-stock-adjustment-pending-transactions-ui',
  templateUrl: './stock-adjustment-pending-transactions-ui.component.html',
  styleUrls: ['./stock-adjustment-pending-transactions-ui.component.css']
})
export class StockAdjustmentPendingTransactionsUIComponent implements OnInit {
  stockAdjustmentHeaders           : any[];
  stockAdjustmentDetails           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'Save To StockAdjustment','Function'            : () => this.onClickSaveToStockAdjustment(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  defaultColumns  = ['Qty','UM','ItemName','Cost','Discount','Amount'];
  defaultColumns2  = ['TransCode', 'ReasonName'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost','Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  transCode : string;
  adjustmentType : string;
  constructor(
    private dialogRef         : MatDialogRef<StockAdjustmentPendingTransactionsUIComponent>,
    private dialog              : MatDialog,
    private stockAdjustmentHeadersService        : StockAdjustmentHeadersService,
    private stockAdjustmentDetailsService        : StockAdjustmentDetailsService,
    private stockAdjustmentTransactionService        : StockAdjustmentTransactionService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
    this.transCode  = this.data[0];
    this.adjustmentType  = this.data[1];
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
    this.stockAdjustmentHeaders = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeadersByRecordStatusByAdjustmentType(this.adjustmentType, 'pending'));
    if(this.stockAdjustmentHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewStockAdjustmentDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.stockAdjustmentDetails = await firstValueFrom(this.stockAdjustmentDetailsService.getStockAdjustmentDetailsByTransCode(this.selectedData.TransCode));
    if(this.stockAdjustmentDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.stockAdjustmentHeaders;

    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.stockAdjustmentDetails;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }
  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.TransCode;
    this.selectedData = data;
    this.onClickViewStockAdjustmentDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransCode+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.deleteStockAdjustmentDetailsByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.stockAdjustmentHeaders = this.stockAdjustmentHeaders.filter(x => x.TransCode != this.selectedData.TransCode);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    this.notificationService.popupWarning("Delete Record","All records will be remove. Continue?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.deleteAllStockAdjustmentHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.stockAdjustmentHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToStockAdjustment(){
    this.notificationService.popupWarning("Save To StockAdjustment","Record will be save to StockAdjustment. Continue?").then((result) => {
      if(result.value){
          if(this.transCode){
            this.stockAdjustmentTransactionService.saveAsPendingStockAdjustmentByTransCode(this.transCode).subscribe({
                next:(res)=>{
                
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
        }
        this.stockAdjustmentTransactionService.backToOngoingStockAdjustmentByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.dialogRef.close(res);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close(false);
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
