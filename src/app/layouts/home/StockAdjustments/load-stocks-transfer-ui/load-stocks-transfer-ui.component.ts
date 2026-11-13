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
  selector: 'app-load-stocks-transfer-ui',
  templateUrl: './load-stocks-transfer-ui.component.html',
  styleUrls: ['./load-stocks-transfer-ui.component.css']
})
export class LoadStocksTransferUIComponent implements OnInit {

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
    {'Label'   : 'Stock In','Function'            : () => this.onClickStockIn(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Close','Function'            : () => this.onClickClose(),'Disabled': true,}, 
  ];
  defaultColumns  = ['Qty','UM','ItemName','Price','Amount'];
  defaultColumns2  = ['TransDate','TransNo', 'Detail', 'InputBy'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  transCode : string;
  adjustmentType : string;
  constructor(
    private dialogRef         : MatDialogRef<LoadStocksTransferUIComponent>,
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
    var data:any            = await firstValueFrom(this.stockAdjustmentHeadersService.getStockAdjustmentHeadersPendingTransfer());
    this.stockAdjustmentHeaders = data['Headers'];
    this.stockAdjustmentDetails = data['Details']
    this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewStockAdjustmentDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
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
    var data = this.stockAdjustmentDetails.filter(x => x.TransNo == this.selectedId);

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
    this.selectedId = data.TransNo;
    this.selectedData = data;
    this.onClickViewStockAdjustmentDetails();
  }

  onClickStockIn(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Stock In","Are you sure to stock in items under "+this.selectedData.TransNo+" ?").then((result) => {
      if (result.value) {
        this.notificationService.popupWarning("Auto Create Item(s)","This will create item(s) if some item(s) are not available in your branch.Continue ?").then((result) => {
          if (result.value) {
            this.stockAdjustmentTransactionService.stockInRecordByTransNoByBranchId(this.transCode, this.selectedData.TransNo, this.selectedData.BranchId).subscribe({
              next:(res)=>{
                this.dialogRef.close(res)
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error.message);
              },
            });
          }
        });
      }
    });
  }

  onClickClose(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Close Delivery","Are you sure to close all items delivery under "+this.selectedData.TransNo+" from "+this.selectedData.Detail+"?").then((result) => {
      if (result.value) {
        this.stockAdjustmentTransactionService.closeStockAdjustmentHeaderByTransNoByBranchId(this.selectedData.TransNo, this.selectedData.BranchId).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.onClickView();
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
