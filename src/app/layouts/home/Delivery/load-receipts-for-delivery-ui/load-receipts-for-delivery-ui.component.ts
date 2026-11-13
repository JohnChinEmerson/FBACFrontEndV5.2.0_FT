import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryTransactionService } from 'src/app/services/Delivery/delivery-transaction.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';

@Component({
  selector: 'app-load-receipts-for-delivery-ui',
  templateUrl: './load-receipts-for-delivery-ui.component.html',
  styleUrls: ['./load-receipts-for-delivery-ui.component.css']
})
export class LoadReceiptsForDeliveryUIComponent implements OnInit {

  receipts           : any=[];
  header           : any=[];
  config           : any=[];
  details : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedItem : any;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  withDate        : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To Delivery','Function'   : () => this.onClickSaveToDeliveryTransaction(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'View Details','Function'            : () => this.onClickViewDetails(),'Disabled': true,}, 
  ];
  defaultColumns  = ['TransDate','TransNo','CustomerName','TotalDue'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  receiptNo: any;
  constructor(
    private dialogRef                   : MatDialogRef<LoadReceiptsForDeliveryUIComponent>,
    private saleHeadersService        : SaleHeadersService,
    private saleDetailsService        : SaleDetailsService,
    private saleConfigService        : SaleConfigService,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private deliveryTransactionService : DeliveryTransactionService,
    private dateTimesService : DateTimesService,
    private router : Router,
    private printService                      : PrintService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.transCode = this.data[0];
    this.receiptNo    = this.data[1];
    this.dateFrom    = this.data[2];
    this.dateTo    = this.data[3];
    this.withDate    = this.data[4];
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
    this.receipts = await firstValueFrom(this.saleHeadersService.getSaleHeadersToBeDeliveredByDateFromByDateToByWithDate(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.withDate
    ));
    if(this.receipts)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.receipts;
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
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }

  onClose(){
    this.dialogRef.close();
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].TransNo;
    this.onClickSaveToDeliveryTransaction();
  }

  onClickSaveToDeliveryTransaction(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
      this.deliveryTransactionService.saveToDeliveryHeaders(this.selectedId, this.transCode).subscribe({
      next: (res)=>{
        this.notificationService.toastrSuccess(res.message);

        var data:any = {
          deliveryDetails : res.deliveryDetails,
          receiptNo : this.selectedId,
        }
        this.dialogRef.close(data);
        this.selectedId = undefined;
      },
      error: (err)=>{
        this.notificationService.toastrError(err.error.message);
      }
    }); 
  }

  onClickViewDetails(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.printSaleReceipt();
  }

  async printSaleReceipt(){
    this.header = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));
    this.details = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(this.selectedId));
    this.config = await firstValueFrom(this.saleConfigService.getSaleConfig());


    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = this.details.filter(x => x.RecordStatus == 'open');
    var title = 'SALES INVOICE OF  - ' + this.header.TransNo ;
    
    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.header));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(this.config));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }

 
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any) {
    if(data)
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }
}
