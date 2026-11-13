import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { SaleReturnTransactionService } from 'src/app/services/SaleReturn/sale-return-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-sale-return-pending-transactions-ui',
  templateUrl: './sale-return-pending-transactions-ui.component.html',
  styleUrls: ['./sale-return-pending-transactions-ui.component.css']
})
export class SaleReturnPendingTransactionsUIComponent implements OnInit {

  saleReturnHeaders           : any[];
  saleReturnDetails           : any[];
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
    {'Label'   : 'Save To SaleReturn','Function'            : () => this.onClickSaveToSaleReturn(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  defaultColumns  = ['Qty','UM','ItemName','Price','Discount','Amount'];
  defaultColumns2  = ['TransCode', 'CustomerName'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price','Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  transCode : string;
  constructor(
    private dialogRef         : MatDialogRef<SaleReturnPendingTransactionsUIComponent>,
    private dialog              : MatDialog,
    private saleReturnHeadersService        : SaleReturnHeadersService,
    private saleReturnDetailsService        : SaleReturnDetailsService,
    private saleReturnTransactionService        : SaleReturnTransactionService,
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
    this.transCode  = this.data;
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
    this.saleReturnHeaders = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeadersByRecordStatus('pending'));
    if(this.saleReturnHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewSaleReturnDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.saleReturnDetails = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransCode(this.selectedData.TransCode));
    if(this.saleReturnDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.saleReturnHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.saleReturnDetails;
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
    this.onClickViewSaleReturnDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransCode+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.saleReturnTransactionService.deleteSaleReturnDetailsByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.saleReturnHeaders = this.saleReturnHeaders.filter(x => x.TransCode != this.selectedData.TransCode);
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
        this.saleReturnTransactionService.deleteAllSaleReturnHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.saleReturnHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToSaleReturn(){
    this.notificationService.popupWarning("Save To SaleReturn","Record will be save to sales. Continue?").then((result) => {
      if(result.value){
          if(this.transCode){
            this.saleReturnTransactionService.saveAsPendingSaleReturnByTransCode(this.transCode).subscribe({
                next:(res)=>{
                
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
        }
        this.saleReturnTransactionService.backToOngoingSaleReturnByTransCode(this.selectedData.TransCode).subscribe({
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

