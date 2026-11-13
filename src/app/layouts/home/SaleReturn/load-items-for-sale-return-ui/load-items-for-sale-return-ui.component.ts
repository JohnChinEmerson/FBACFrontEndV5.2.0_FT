import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { SaleReturnTransactionService } from 'src/app/services/SaleReturn/sale-return-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SaleReturnDetailUIComponent } from '../sale-return-detail-ui/sale-return-detail-ui.component';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';

@Component({
  selector: 'app-load-items-for-sale-return-ui',
  templateUrl: './load-items-for-sale-return-ui.component.html',
  styleUrls: ['./load-items-for-sale-return-ui.component.css']
})
export class LoadItemsForSaleReturnUIComponent implements OnInit {

  saleDetails           : any=[];
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
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Save To SaleReturn','Function'   : () => this.onClickSaveToSaleReturn(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['TransDate','TransNo','ItemName','UM','Qty','Price','Discount', 'Amount','PaidStatus','ExpiryDate','BatchLotNo'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: ['TransDate'],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  customerId: string;
  saleReturnDetails: any=[];
  saleReturnHeader: any;
  stock: any;
  ui: any;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForSaleReturnUIComponent>,
    private saleDetailsService        : SaleDetailsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private saleReturnTransactionService : SaleReturnTransactionService,
    private saleReturnHeadersService : SaleReturnHeadersService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.transCode = this.data[0];
    this.customerId    = this.data[1];
    this.saleReturnDetails = this.data[2];
    this.saleReturnHeader = this.data[2];
    this.ui = this.data[3];
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
    this.saleDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.customerId,
      this.withDate
    ));
    if(this.saleDetails)
      this.isLoading = false;
    this.displayRecords();
  }


  displayRecords(){
    var data = this.saleDetails;
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
    if(this.ui == 'salereturntransaction'){
      this.dialogRef.close(this.saleReturnDetails);
    }
    if(this.ui == 'salereturnreceipts'){
      this.dialogRef.close(this.saleReturnHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].id;
    this.onClickSaveToSaleReturn();
  }

  onClickSaveToSaleReturn(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.saleDetails.filter(x => x.id == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    if( this.ui == 'salereturnreceipts')
      this.PopupQtyUI2();
    else{
      this.saleReturnTransactionService.saveToSaleReturnHeaders(this.selectedId, this.transCode, this.customerId, this.selectedItem.Price, 'open').subscribe({
        next: (res)=>{
          this.transCode = res.saleReturnDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);
          this.saleReturnDetails = [ res.saleReturnDetail,...this.saleReturnDetails]; 
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
    var stock:any     = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedId));
    stock.TransCode   = this.transCode;
    stock.CustomerId  = this.customerId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'salereturntransaction'){
      dialogConfig.data = (['',stock, 'additemsalereturntransaction']);
    }
    if(this.ui == 'salereturnreceipts'){
      stock.TransNo   = this.saleReturnHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemsalereturnreceipts'
      ]);
    }
    this.dialog.open(SaleReturnDetailUIComponent,dialogConfig).beforeClosed().subscribe(async saleReturnDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(saleReturnDetail) ? saleReturnDetail[0] : saleReturnDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.onClickView();
      if(this.ui == 'salereturntransaction'){
        this.saleReturnDetails = [ saleReturnDetail,...this.saleReturnDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'salereturnreceipts'){
        this.saleReturnHeader = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(saleReturnDetail.TransNo));
      }
    });
   
  }

}
