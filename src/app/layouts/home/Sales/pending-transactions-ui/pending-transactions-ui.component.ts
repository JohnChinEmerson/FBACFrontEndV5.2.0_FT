import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { SalesTransactionService } from 'src/app/services/Sales/sales-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-pending-transactions-ui',
  templateUrl: './pending-transactions-ui.component.html',
  styleUrls: ['./pending-transactions-ui.component.css']
})
export class PendingTransactionsUIComponent implements OnInit {

  saleHeaders           : any[];
  saleDetails           : any[];
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
    {'Label'   : 'Save To Sales','Function'            : () => this.onClickSaveToSales(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  defaultColumns  = ['Qty','UM','ItemName','Price','Discount','Amount'];
  defaultColumns2  = ['TransNo', 'CustomerName'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  transNo : string;
  constructor(
    private dialogRef         : MatDialogRef<PendingTransactionsUIComponent>,
    private dialog              : MatDialog,
    private saleHeadersService        : SaleHeadersService,
    private saleDetailsService        : SaleDetailsService,
    private salesTransactionService        : SalesTransactionService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.transNo  = this.data;
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
    // "Save To Sales" is not an access-right button of Sales Transaction (it is in no access right), so it was
    // always disabled: whoever may open Show Pending may open a pending sale again (Remove keeps its own right)
    this.toolButtons.filter(b => b.Label == 'Save To Sales').forEach(b => b.Disabled = true);
    this.onClickView();
  }

  async onClickView(){
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.isLoading = true;
    this.saleHeaders = await firstValueFrom(this.salesTransactionService.getPendingSales());
    if(this.saleHeaders)
      this.isLoading = false;
    this.displayRecords();
   
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async onClickViewSaleDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.saleDetails = await firstValueFrom(this.saleDetailsService.getOrderDetails(this.selectedData.TransNo));
    if(this.saleDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.saleHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.saleDetails;
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
    this.onClickViewSaleDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransNo+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.salesTransactionService.cancelPendingSale(this.selectedData.TransNo).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.deleted.push(this.selectedData.TransNo);
              this.saleHeaders = this.saleHeaders.filter(x => x.TransNo != this.selectedData.TransNo);
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
        this.salesTransactionService.deleteAllSaleHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.deleted.push('*');
              this.saleHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToSales(){
    this.notificationService.popupWarning("Save To Sales","Record will be save to sales. Continue?").then((result) => {
      if(result.value){
        // the current sale's lines are already saved as pending (Desktop): it stays in this list
        this.salesTransactionService.resumePendingSale(this.selectedData.TransNo).subscribe({
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

  // the sales deleted here ('*' = all): the Sales screen starts a new sale when the one it shows was deleted
  deleted: string[] = [];

  onClose(){
    this.dialogRef.close(this.deleted.length ? { deleted: this.deleted } : false);
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
