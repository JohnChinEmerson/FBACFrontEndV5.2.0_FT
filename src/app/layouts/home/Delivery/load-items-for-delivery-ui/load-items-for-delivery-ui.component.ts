import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { DeliveryHeadersService } from 'src/app/services/Delivery/delivery-headers.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DeliveryDetailUIComponent } from '../delivery-detail-ui/delivery-detail-ui.component';
import { DeliveryTransactionService } from 'src/app/services/Delivery/delivery-transaction.service';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';

@Component({
  selector: 'app-load-items-for-delivery-ui',
  templateUrl: './load-items-for-delivery-ui.component.html',
  styleUrls: ['./load-items-for-delivery-ui.component.css']
})
export class LoadItemsForDeliveryUIComponent implements OnInit {
  saleDetails           : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedItem : any;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To Delivery','Function'   : () => this.onClickSaveToDelivery(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['ItemName','UM','Category','Qty','TobeDelivered','Discount', 'Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','TobeDelivered','Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};

  transCode: string;
  customerId: string;
  deliveryDetails: any=[];
  deliveryHeader: any;
  deliveryConfig: any=[];
  deliveryDetail: any;
  ui: any;
  customer: any=[];
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForDeliveryUIComponent>,
    private saleDetailsService        : SaleDetailsService,
    private deliveryDetailsService        : DeliveryDetailsService,
    private notificationService : NotificationService,
    private customersService      : CustomersService,
    public matTableService     : MatTableService,
    private deliveryConfigService        : DeliveryConfigService,
    private deliveryTransactionService : DeliveryTransactionService,
    private deliveryHeadersService : DeliveryHeadersService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.transCode = this.data[0];
    this.customerId    = this.data[1];
    this.deliveryDetails = this.data[2];
    this.deliveryHeader = this.data[2];
    this.ui = this.data[3];
    this.getDeliveryConfig();
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getDeliveryConfig(){
    this.deliveryConfig = await firstValueFrom(this.deliveryConfigService.getDeliveryConfig());
  }

  async onClickView(){
    this.isLoading = true;
    this.deliveryDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsForDelivery(this.deliveryHeader.SaleNo));
    if(this.deliveryDetails)
      this.isLoading = false;
    this.displayRecords();
  }


  displayRecords(){
    var data = this.deliveryDetails;
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
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClose(){
    if(this.ui == 'deliverytransaction'){
      this.dialogRef.close(this.deliveryDetails);
    }
    if(this.ui == 'deliveryreceipts'){
      this.dialogRef.close(this.deliveryHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].ItemId;
    this.onClickSaveToDelivery();
  }

  onClickSaveToDelivery(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.deliveryDetails.filter(x => x.ItemId == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    this.PopupQtyUI2();
  }

  async PopupQtyUI2()
  {
    var saleDetail:any     = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedId));
    saleDetail.TransCode   = this.transCode;
    saleDetail.CustomerId  = this.customerId;
    saleDetail.TransNo   = this.deliveryHeader.TransNo;
    saleDetail.TobeDelivered   = this.selectedData.TobeDelivered;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',saleDetail, 'additemdeliveryreceipts']);

    this.dialog.open(DeliveryDetailUIComponent,dialogConfig).beforeClosed().subscribe(async deliveryDetail => {
      this.deliveryHeader = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(deliveryDetail.TransNo));
    });
   
  }

}
