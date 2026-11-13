import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ReceivingTransactionService } from 'src/app/services/Receiving/receiving-transaction.service';
import { HomeComponent } from '../../home.component';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-pofor-delivery-ui',
  templateUrl: './pofor-delivery-ui.component.html',
  styleUrls: ['./pofor-delivery-ui.component.css']
})
export class POForDeliveryUIComponent implements OnInit {

  transCode : any;
  action : any;
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
  supplierId      : string;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons     = [
    {'Label'   : 'Load','Function'                : () => this.onClickLoad(),'Disabled': true,}, 
    {'Label'   : 'Close PODelivery','Function'                : () => this.onClickClosePODelivery(),'Disabled': true,}, 
    {'Label'   : 'Close All PODelivery','Function'                : () => this.onClickCloseAllPODelivery(),'Disabled': true,}, 
  ];

  defaultColumns    = ['TransDate','TransNo', 'SupplierName','TotalDue'];
  defaultColumns2    = ['Qty','UM', 'ItemName','Cost','Discount', 'Amount','QtyDelivered', 'Undelivered'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','Qty','Cost','Discount', 'Amount','QtyDelivered', 'Undelivered'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private poDetailsService : PODetailsService,
    private poHeadersService : POHeadersService,
    private receivingTransactionService : ReceivingTransactionService,
    public matTableService : MatTableService,
    private notificationService : NotificationService,
    private dialogRef              : MatDialogRef<POForDeliveryUIComponent>,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(null, null, this.contextButtons, null);
    this.transCode = this.data[0];
    this.supplierId = this.data[1];
    this.action = this.data[2];
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
    this.headers = await firstValueFrom(this.poHeadersService.getPOHeadersUndelivered());
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
    this.details = await firstValueFrom(this.poDetailsService.getPODetailsUndeliveredByTransNo(this.selectedId));
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
      'poHeader' : this.selectedData,
      'poDetails' : this.details,
      'transCode' : this.transCode,
      'action' : this.action,
    };
    this.receivingTransactionService.loadPO(data).subscribe({
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

  onClickClosePODelivery(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    this.notificationService.popupWarning("Close Record", this.selectedId + " Delivery Status will be CLOSED. Continue?").then(async (result) => {
      if (result.value) {
        this.poHeadersService.closePODeliveryHeaderByTransNo(this.selectedId).subscribe({
          next :(res) =>{
            this.poDetailsService.closePODeliveryDetailsByTransNo(this.selectedId).subscribe({
              next :(res) =>{
                this.getUndeliveredHeaders();
                this.getUndeliveredDetails();
              },  
              error :(err)=>{
                this.notificationService.toastrError(err.error.message);
              },
            });
          },  
          error :(err)=>{
            this.notificationService.toastrError(err.error.message);
          },
        });
      }
    });
  }

  
  onClickCloseAllPODelivery(){
     this.notificationService.popupWarning("Close Record", "All Delivery Status will be CLOSED. Continue?").then(async (result) => {
      if (result.value) {
        this.poHeadersService.closePODeliveryHeaderByTransNo('all').subscribe({
          next :(res) =>{
            this.poDetailsService.closePODeliveryDetailsByTransNo('all').subscribe({
              next :(res) =>{
                this.getUndeliveredHeaders();
                this.getUndeliveredDetails();
              },  
              error :(err)=>{
                this.notificationService.toastrError(err.error.message);
              },
            });
          },  
          error :(err)=>{
            this.notificationService.toastrError(err.error.message);
          },
        });
      }
    });
  }

}
