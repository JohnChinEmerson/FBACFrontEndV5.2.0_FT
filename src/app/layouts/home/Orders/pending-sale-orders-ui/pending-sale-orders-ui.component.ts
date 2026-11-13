import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderDetailsService } from 'src/app/services/Orders/order-details.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { SalesTransactionService } from 'src/app/services/Sales/sales-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-pending-sale-orders-ui',
  templateUrl: './pending-sale-orders-ui.component.html',
  styleUrls: ['./pending-sale-orders-ui.component.css']
})
export class PendingSaleOrdersUIComponent implements OnInit {
  transCode : any;
  action : any;
  recordStatusCashiering : any;
  headers : any=[];
  details : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedData2    : any;
  selectedId2      : number = 0;
  searchKey2       : string = "";
  listData2        : MatTableDataSource<any>;
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading2       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons     = [
    {'Label'   : 'Load','Function'                : () => this.onClickLoad(),'Disabled': true,}, 
  ];

  defaultColumns    = ['TransDate','TransNo', 'CustomerName','TotalDue'];
  defaultColumns2    = ['Qty','UM', 'ItemName','Price','Discount', 'Amount','QtyDelivered', 'Undelivered'];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','Qty','Price','Discount', 'Amount','QtyDelivered', 'Undelivered'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private orderDetailsService : OrderDetailsService,
    private orderHeadersService : OrderHeadersService,
    private salesTransactionService : SalesTransactionService,
    public matTableService : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    private dialogRef              : MatDialogRef<PendingSaleOrdersUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(null, null, this.contextButtons, null);
    this.transCode = this.data[0];
    this.action = this.data[1];
    this.recordStatusCashiering = this.data[2];
    this.getUndeliveredHeaders();
  }
  
  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getUndeliveredHeaders(){
    this.isLoading = true;
    this.headers = await firstValueFrom(this.orderHeadersService.getOrderHeadersUndelivered());
    if(this.headers)
      this.isLoading = false;
    this.displayRecords1();
  }

  displayRecords1(){
    var data = this.headers;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  applyFilter1(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch1(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data){
    this.selectedId = data.TransNo;
    this.selectedData = data;
    this.getUndeliveredDetails();
  }

  async getUndeliveredDetails(){
    this.isLoading2 = true;
    this.details = await firstValueFrom(this.orderDetailsService.getOrderDetailsUndeliveredByTransNo(this.selectedId));
    if(this.details)
      this.isLoading2 = false;
    this.displayRecords2();
  }
  displayRecords2(){
    var data = this.details;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }

  clearSearch2(){
    this.searchKey2 =  this.matTableService.clearSearch(this.listData2);
  }

  onClickLoad(){
    var data:any = {
      'oHeader' : this.selectedData,
      'oDetails' : this.details,
      'transCode' : this.transCode,
      'action' : this.action,
      'recordStatusCashiering' : this.recordStatusCashiering,
    };
    this.salesTransactionService.loadSO(data).subscribe({
      next :(res) =>{
        this.notificationService.toastrSuccess(res.message);
        this.dialogRef.close(res);
      },  
      error :(err)=>{
        this.notificationService.toastrError(err.error.message);
      },
    });
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
