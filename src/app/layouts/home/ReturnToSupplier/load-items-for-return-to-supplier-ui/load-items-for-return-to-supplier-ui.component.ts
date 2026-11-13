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
import { ReturnToSupplierHeadersService } from 'src/app/services/ReturnToSupplier/return-to-supplier-headers.service';
import { ReturnToSupplierTransactionService } from 'src/app/services/ReturnToSupplier/return-to-supplier-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ReturnToSupplierDetailUIComponent } from '../return-to-supplier-detail-ui/return-to-supplier-detail-ui.component';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';

@Component({
  selector: 'app-load-items-for-return-to-supplier-ui',
  templateUrl: './load-items-for-return-to-supplier-ui.component.html',
  styleUrls: ['./load-items-for-return-to-supplier-ui.component.css']
})
export class LoadItemsForReturnToSupplierUIComponent implements OnInit {

  receivingDetails           : any=[];
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
    {'Label'   : 'Save To ReturnToSupplier','Function'   : () => this.onClickSaveToReturnToSupplier(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['TransDate','TransNo','ItemName','UM','Qty','Cost','Discount', 'Amount','PaidStatus','ExpiryDate','BatchLotNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: ['TransDate'],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  transCode: string;
  supplierId: string;
  returnToSupplierDetails: any=[];
  returnToSupplierHeader: any;
  stock: any;
  ui: any;
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<LoadItemsForReturnToSupplierUIComponent>,
    private receivingDetailsService        : ReceivingDetailsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private returnToSupplierTransactionService : ReturnToSupplierTransactionService,
    private returnToSupplierHeadersService : ReturnToSupplierHeadersService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.transCode = this.data[0];
    this.supplierId    = this.data[1];
    this.returnToSupplierDetails = this.data[2];
    this.returnToSupplierHeader = this.data[2];
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
    this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.supplierId,
      this.withDate
    ));
    if(this.receivingDetails)
      this.isLoading = false;
    this.displayRecords();
  }


  displayRecords(){
    var data = this.receivingDetails;
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
    if(this.ui == 'returntosuppliertransaction'){
      this.dialogRef.close(this.returnToSupplierDetails);
    }
    if(this.ui == 'returntosupplierreceipts'){
      this.dialogRef.close(this.returnToSupplierHeader);
    }
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
    this.selectedId = this.listData.filteredData[0].id;
    this.onClickSaveToReturnToSupplier();
  }

  onClickSaveToReturnToSupplier(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.selectedItem  = this.receivingDetails.filter(x => x.id == this.selectedId);
    this.selectedItem = this.selectedItem[0];

    if( this.ui == 'returntosupplierreceipts')
      this.PopupQtyUI2();
    else{
      this.returnToSupplierTransactionService.saveToReturnToSupplierHeaders(this.selectedId, this.transCode, this.supplierId, this.selectedItem.Cost, 'open').subscribe({
        next: (res)=>{
          this.transCode = res.returnToSupplierDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
          this.notificationService.toastrSuccess(res.message);  
          this.returnToSupplierDetails = [ res.returnToSupplierDetail,...this.returnToSupplierDetails]; 
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
    var stock:any     = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedId));
    stock.TransCode   = this.transCode;
    stock.CustomerId  = this.supplierId;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    if(this.ui == 'returntosuppliertransaction'){
      dialogConfig.data = (['',stock, 'additemreturntosuppliertransaction']);
    }
    if(this.ui == 'returntosupplierreceipts'){
      stock.TransNo   = this.returnToSupplierHeader.TransNo;
      dialogConfig.data = (['',stock, 'additemreturntosupplierreceipts'
      ]);
    }
    this.dialog.open(ReturnToSupplierDetailUIComponent,dialogConfig).beforeClosed().subscribe(async returnToSupplierDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(returnToSupplierDetail) ? returnToSupplierDetail[0] : returnToSupplierDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.onClickView();
      if(this.ui == 'returntosuppliertransaction'){
        this.returnToSupplierDetails = [ returnToSupplierDetail,...this.returnToSupplierDetails]; 
        this.selectedId = undefined;
      }
      if(this.ui == 'returntosupplierreceipts'){
        this.returnToSupplierHeader = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransNo(returnToSupplierDetail.TransNo));
      }
    });
   
  }
}
